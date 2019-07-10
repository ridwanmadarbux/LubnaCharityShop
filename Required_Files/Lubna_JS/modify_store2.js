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