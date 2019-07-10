//var x = add_store("Lubna Shop 2","2, walthamstow Street","Walthamstow","Waltham Forest","London","E17 0AA","2019-10-23")
//var x = add_store("Lubna Charity Shop Chingford","1, Chingford Road","Chingford","","","E4 0AA","2019-05-01")
//var x = add_store("Lubna Shop","3, walthamstow Street","Walthamstow","Waltham Forest","London","E17 0AA","2019-05-17")
//var x = add_store("Lubna CharityShop Finsbury","45 Beaufont Road ","Finsbury Park","Finsbury ","London","E16 92E","2019-06-24")
//var x = add_store("Lubna Shop for kids","30 Morrison road ","Stratford","Stratford","London","E15 4EJ","2019-05-26")
//var x = add_store("Lubna Charity shop Leyton","12 Newham road ","Leyton","Leyton","London","E13 3AD","2019-07-01")
//var x = add_store("Lubna Charity Hackney","5 robert lane","Hackney","Hackney","London","E3 4SG","2019-06-07")
//var x = add_store("Lubna Charity Shop Ilford","21 Dawlish Drive","Ilford","Ilford","London","E5 6XE","2019-06-28")
//var x = add_store("Lubna Charity Shop Dagenham","40 Bloxhall road ","Dagenham","Romford","London","E12 6HE","2019-07-02")
//var x = add_store("Lubna Charity Shop kent","8 Overmead Street ","Swanley","Kent","Kent","E12 5KL","2019-05-22")
//var x = add_store("Lubna Charity Shop Woodford","9 Tudor road ","Woodfrod","Woodford","London","E17 4DS","2019-06-20")
//var x = add_store("Lubna Charity Shop mile End","17 churchill road ","Mile End","Mile End ","London","E5 4BA","2019-06-01")


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