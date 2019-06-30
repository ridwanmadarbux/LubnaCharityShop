var x = add_product("Matrix Movie","First matrix movie with Keanu Reeves","In Stock",50.00,"Miscellaneous","Individual Donation","2019-10-23")

function add_product(product_name, product_description, product_status, price, product_type, origin, date_added)
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
				var request = new Request("INSERT INTO sources.products" +
					" (Product_id,Product_name,Product_description,Product_status,Price,Product_type,Origin)" +
					"VALUES" +
					" ((select max(Product_id)+1 from sources.products),@Product_name,@Product_description,@Product_status,@Price,@Product_type,@Origin);"+
					"INSERT INTO transactions.creation" +
					" (Creation_id, Table_being_added, ID_of_Record_being_added, Store_id, Employee_id, Date_of_creation)" +
					"VALUES" +
					" ((select max(Creation_id)+1 from transactions.creation),'sources.products',(select max(Product_id) from sources.products),(select max(Store_id) from sources.employee_store where Employee_id = (select Employee_id from transactions.login_table where Login_Time = (select max(Login_Time) from transactions.login_table))),(select Employee_id from transactions.login_table where Login_Time = (select max(Login_Time) from transactions.login_table)),@Date_Added);", 
					function (err, rowCount) {
					if (err)
						console.error(err);

					console.log('rowCount: ' + rowCount);
					
					//release the connection back to the pool when finished
					//connection.release();
					process.exit();
				});

				request.addParameter('Product_name', TYPES.VarChar, product_name);
				request.addParameter('Product_description', TYPES.VarChar, product_description);
				request.addParameter('Product_status', TYPES.VarChar, product_status);
				request.addParameter('Price', TYPES.Money, price);
				request.addParameter('Product_type', TYPES.VarChar, product_type);
				request.addParameter('Origin', TYPES.VarChar, origin);
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