function add_store(store_name, address_1, address_2, address_3, address_4, post_code, date_added)
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
				var request = new Request("INSERT INTO sources.store" +
					" (Store_id,Store_name,Address_Line_1,Address_Line_2,Address_Line_3,Address_Line_4,Address_Post_Code)" +
					"VALUES" +
					" ((select max(store_id)+1 from sources.store),@Store_name,@Address_Line_1,@Address_Line_2,@Address_Line_3,@Address_Line_4,@Address_Post_Code);"+
					"INSERT INTO transactions.creation" +
					" (Creation_id, Table_being_added, ID_of_Record_being_added, Store_id, Employee_id, Date_of_creation)" +
					"VALUES" +
					" ((select max(Creation_id)+1 from transactions.creation),'sources.store',(select max(store_id) from sources.store),(select max(Store_id) from sources.employee_store where Employee_id = (select Employee_id from transactions.login_table where Login_Time = (select max(Login_Time) from transactions.login_table))),(select Employee_id from transactions.login_table where Login_Time = (select max(Login_Time) from transactions.login_table)),@Date_Added);", 
					function (err, rowCount) {
					if (err)
						console.error(err);

					console.log('rowCount: ' + rowCount);
					
					//release the connection back to the pool when finished
					//connection.release();
					process.exit();
				});

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