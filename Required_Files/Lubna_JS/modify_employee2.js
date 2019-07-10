function modify_employee2(Employee_id, Login_Password, Title, First_Name, Middle_Name, Last_Name, Address_Line_1, Address_Line_2, Address_Line_3, Address_Line_4, Address_Post_Code, Job_Title, Job_Grade, Salary, Bank_Name, Bank_Account_Number, Bank_Sort_Code, Email_Add, Phone_Num_Area_Code, Phone_Num, date_added)
{
	var Connection = require('tedious').Connection;
	var Request = require('tedious').Request;
	var TYPES = require('tedious').TYPES;

	// Create connection to database
	var config =
	{
		authentication: {
			options: {
				userName: 'lubnamakoon01',
				password: 'Lub_5361252211'
			},
			type: 'default'
		},
		server: 'lubnamakoon.database.windows.net',
		options:
		{
			database: 'LubnaCharityShop',
			encrypt: true
		}
	}
	var connection = new Connection(config);
	// Attempt to connect and execute queries if connection goes through
	connection.on('connect', function(err)
		{
			if (err)
			{
				console.log(err)
			}
			else
			{
				var request = new Request("INSERT INTO modifications.employee" +
					" (Employee_Modification_id, Employee_id,Login_Password,Title,First_Name,Middle_Name,Last_Name,Address_Line_1,Address_Line_2,Address_Line_3,Address_Line_4,Address_Post_Code, Job_Title,Job_Grade,Salary,Bank_Name,Bank_Account_Number,Bank_Sort_Code,Email_Add,Phone_Num_Area_Code,Phone_Num)" +
					" SELECT" +
					" (select max(Employee_Modification_id)+1 from modifications.employee),@Employee_id,Login_Password,Title, First_Name, Middle_Name, Last_Name, Address_Line_1, Address_Line_2, Address_Line_3, Address_Line_4, Address_Post_Code, Job_Title, Job_Grade, Salary, Bank_Name, Bank_Account_Number, Bank_Sort_Code, Email_Add, Phone_Num_Area_Code, Phone_Num"+
					" FROM Sources.employee"+
					" WHERE Employee_id = @Employee_id;"+
					" INSERT INTO transactions.changes_table" +
					" (Change_id, Table_being_modified, ID_of_Modified_Record, Store_id, Employee_id, Date_of_change)" +
					" VALUES" +
					" ((select max(Change_id)+1 from transactions.changes_table),'sources.employee',@Employee_id,(select max(Store_id) from sources.employee_store where Employee_id = (select Employee_id from transactions.login_table where Login_Time = (select max(Login_Time) from transactions.login_table))),(select Employee_id from transactions.login_table where Login_Time = (select max(Login_Time) from transactions.login_table)),@Date_Added);"+
					" UPDATE sources.employee"+
					" SET Login_Password = @Login_Password,"+
					" Title = @Title," +
					" First_Name = @First_Name,"+
					" Middle_Name = @Middle_Name,"+
					" Last_Name = @Last_Name,"+
					" Address_Line_1 = @Address_Line_1,"+
					" Address_Line_2 = @Address_Line_2,"+
					" Address_Line_3 = @Address_Line_3,"+
					" Address_Line_4 = @Address_Line_4,"+
					" Address_Post_Code = @Address_Post_Code,"+
					" Job_Title = @Job_Title,"+
					" Job_Grade = @Job_Grade,"+
					" Salary = @Salary,"+
					" Bank_Name = @Bank_Name,"+
					" Bank_Account_Number = @Bank_Account_Number,"+
					" Bank_Sort_Code = @Bank_Sort_Code,"+
					" Email_Add = @Email_Add,"+
					" Phone_Num_Area_Code = @Phone_Num_Area_Code,"+
					" Phone_Num = @Phone_Num"+
					" WHERE Employee_id = @Employee_id;",
					function (err, rowCount) {
					if (err)
						console.error(err);

					console.log('rowCount: ' + rowCount);
					
					//release the connection back to the pool when finished
					//connection.release();
					process.exit();
				});

				request.addParameter('Employee_id', TYPES.Int, Employee_id);
				request.addParameter('Login_Password', TYPES.VarChar, Login_Password);
				request.addParameter('Title', TYPES.VarChar, Title);
				request.addParameter('First_Name', TYPES.VarChar, First_Name);
				request.addParameter('Middle_Name', TYPES.VarChar, Middle_Name);
				request.addParameter('Last_Name', TYPES.VarChar, Last_Name);
				request.addParameter('Address_Line_1', TYPES.VarChar, Address_Line_1);
				request.addParameter('Address_Line_2', TYPES.VarChar, Address_Line_2);
				request.addParameter('Address_Line_3', TYPES.VarChar, Address_Line_3);
				request.addParameter('Address_Line_4', TYPES.VarChar, Address_Line_4);
				request.addParameter('Address_Post_Code', TYPES.VarChar, Address_Post_Code);
				request.addParameter('Job_Title', TYPES.VarChar, Job_Title);
				request.addParameter('Job_Grade', TYPES.VarChar, Job_Grade);
				request.addParameter('Salary', TYPES.Money, Salary);
				request.addParameter('Bank_Name', TYPES.VarChar, Bank_Name);
				request.addParameter('Bank_Account_Number', TYPES.Int, Bank_Account_Number);
				request.addParameter('Bank_Sort_Code', TYPES.Int, Bank_Sort_Code);
				request.addParameter('Email_Add', TYPES.VarChar, Email_Add);
				request.addParameter('Phone_Num_Area_Code', TYPES.Int, Phone_Num_Area_Code);
				request.addParameter('Phone_Num', TYPES.BigInt, Phone_Num);
				request.addParameter('Date_Added', TYPES.Date, date_added);


				request.on('row', function (columns) {
					console.log('value: ' + columns[0].value);
				});

				connection.execSql(request);
			}
		}
	);

	return 0;
}