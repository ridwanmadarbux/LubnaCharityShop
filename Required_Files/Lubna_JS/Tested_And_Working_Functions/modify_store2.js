//var x = modify_store2(3000002,"Lubna Shop 2 - Modified","24, walthamstow Street","New Walthamstow","Waltham Forest","London","E17 4AA","2019-07-01")
//var x = modify_store2(3000008,"Lubna Charity Shop Woodford","9 Tudor road","Woodford","Woodford","London","E17 4DS","2019-06-02")
//var x = modify_store2(3000004,"Lubna CharityShop Finsbury","48 Beaufont Road","Finsbury Park","Finsbury","London","E16 92E","2019-05-22")
//var x = modify_store2(3000010,"Lubna Charity Shop Dagenham","40 Bloxhall road","Dagenham","Romford","London","E12 6HE","2019-05-28")
//var x = modify_store2(3000011,"Lubna Charity Shop Ilford","21 Dawlish Drive","Ilford","Ilford","London","E5 6XE","2019-06-23")
//var x = modify_store2(3000002,"Lubna Shop 2 - Modified","24, walthamstow Street","New Walthamstow","Waltham Forest","London","E17 4AA","2019-06-01")

function modify_store2(store_id,store_name, address_1, address_2, address_3, address_4, post_code, date_added)
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
				var request = new Request("INSERT INTO modifications.store" +
					" (Store_Modification_id,Store_id,Store_name,Address_Line_1,Address_Line_2,Address_Line_3,Address_Line_4,Address_Post_Code)" +
					"SELECT" +
					" (select max(Store_Modification_id)+1 from modifications.store),@Store_id,Store_name,Address_Line_1,Address_Line_2,Address_Line_3,Address_Line_4,Address_Post_Code"+
					" FROM sources.store"+
					" WHERE Store_id = @Store_id;" +
					"INSERT INTO transactions.changes_table" +
					" (Change_id, Table_being_modified, ID_of_Modified_Record, Store_id, Employee_id, Date_of_change)" +
					" VALUES" +
					" ((select max(Change_id)+1 from transactions.changes_table),'sources.store', @Store_id,(select max(Store_id) from sources.employee_store where Employee_id = (select Employee_id from transactions.login_table where Login_Time = (select max(Login_Time) from transactions.login_table))),(select Employee_id from transactions.login_table where Login_Time = (select max(Login_Time) from transactions.login_table)),@Date_Added);"+
					"UPDATE sources.store"+
					" SET Store_Name = @Store_Name,"+
					" Address_Line_1 = @Address_Line_1,"+
					" Address_Line_2 = @Address_Line_2,"+
					" Address_Line_3 = @Address_Line_3,"+
					" Address_Line_4 = @Address_Line_4,"+
					" Address_Post_Code = @Address_Post_Code"+
					" WHERE Store_id = @Store_id;", 
					function (err, rowCount) {
					if (err)
						console.error(err);

					console.log('rowCount: ' + rowCount);
					
					//release the connection back to the pool when finished
					//connection.release();
					process.exit();
				});

				request.addParameter('Store_id', TYPES.Int, store_id);
				request.addParameter('Store_name', TYPES.VarChar, store_name);
				request.addParameter('Address_Line_1', TYPES.VarChar, address_1);
				request.addParameter('Address_Line_2', TYPES.VarChar, address_2);
				request.addParameter('Address_Line_3', TYPES.VarChar, address_3);
				request.addParameter('Address_Line_4', TYPES.VarChar, address_4);
				request.addParameter('Address_Post_Code', TYPES.VarChar, post_code);
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