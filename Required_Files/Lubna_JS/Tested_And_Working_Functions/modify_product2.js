//var x = modify_product2(2000002,"Matrix Movie - Modified","First matrix movie with Keanu Reeves","In Stock",51.50,"Miscellaneous","Individual Donation","2019-01-07")
//var x = modify_product2(2000005,"Pyjamas","","In Stock",6.0000,"Clothes","Individual Donation","2019-05-07")
//var x = modify_product2(2000030,"Polo Shirts","","In Stock",10.0000,"Clothes","Individual Donation","2019-06-18")
//var x = modify_product2(2000037,"Bracelets","","In Stock",10.0000,"Jewelry","Individual Donation","2019-05-17")
//var x = modify_product2(2000047,"Boots","","In Stock",15.0000,"Miscellaneous","Individual Donation","2019-06-08")
//var x = modify_product2(2000064,"Beddings","","In Stock",9.0000,"Miscellaneous","Individual Donation","2019-05-20")
//var x = modify_product2(2000077,"Food processor","","In Stock",16.0000,"Miscellaneous","Company Donation","2019-05-07")
//var x = modify_product2(2000090,"Wall oil painting","","In Stock",6.0000,"Painting","Unknown","2019-06-08")
//var x = modify_product2(2000097,"Clocks","","In Stock",6.0000,"Decoration","Unknown","2019-05-11")
//var x = modify_product2(2000113,"Mug holder","","In Stock",3.0000,"Decoration","Individual Donation","2019-06-24")
//var x = modify_product2(2000129,"Pots","","In Stock",5.0000,"Miscellaneous","Individual Donation","2019-06-10")


function modify_product2(product_id, product_name, product_description, product_status, price, product_type, origin, date_added)
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
				var request = new Request("INSERT INTO modifications.products" +
					" (Products_Modification_id,Product_id,Product_name,Product_description,Product_status,Price,Product_type,Origin)" +
					" SELECT" +
					" (select max(Products_Modification_id)+1 from modifications.products),@Product_id,Product_name,Product_description,Product_status,Price,Product_type,Origin"+
					" FROM sources.products"+
					" WHERE Product_id = @Product_id;"+
					"INSERT INTO transactions.changes_table" +
					" (Change_id, Table_being_modified, ID_of_Modified_Record, Store_id, Employee_id, Date_of_change)" +
					"VALUES" +
					" ((select max(Change_id)+1 from transactions.changes_table),'sources.products',@Product_id,(select max(Store_id) from sources.employee_store where Employee_id = (select Employee_id from transactions.login_table where Login_Time = (select max(Login_Time) from transactions.login_table))),(select Employee_id from transactions.login_table where Login_Time = (select max(Login_Time) from transactions.login_table)),@Date_Added);"+
					"UPDATE sources.products"+
					" SET Product_name = @Product_name,"+
					" Product_description = @Product_description,"+
					" Product_status = @Product_status,"+
					" Price = @Price,"+
					" Product_type = @Product_type,"+
					" Origin = @Origin"+
					" WHERE Product_id = @Product_id;", 
					function (err, rowCount) {
					if (err)
						console.error(err);

					console.log('rowCount: ' + rowCount);
					
					//release the connection back to the pool when finished
					//connection.release();
					process.exit();
				});

				request.addParameter('Product_id', TYPES.Int, product_id);
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