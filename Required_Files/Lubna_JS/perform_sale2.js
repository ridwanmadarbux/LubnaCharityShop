function perform_sale2(Product_id_combination, Payment_type, date_added)
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
				var request = new Request("UPDATE sources.products" +
					" SET Product_Status = 'Sold'" +
					" WHERE Product_id in (SELECT value FROM STRING_SPLIT(@Product_id_combination,','));"+
					" INSERT INTO sources.sales"+
					" (sales_id, Total_amount, Number_of_items, Payment_type, Date_of_sale)"+
					" VALUES"+
					" ((select max(sales_id)+1 from sources.sales),(select sum(Price) from sources.products where Product_id in (select value from STRING_SPLIT(@Product_id_combination,','))),(select count(*) from STRING_SPLIT(@Product_id_combination,',')),@Payment_type,@date_added);" +
					" INSERT INTO transactions.sales_transaction" +
					" (Sales_transaction_id, Sales_id, Product_id, Employee_id, Store_id, Date_of_transaction)" +
					" SELECT" +
					" (select max(Sales_transaction_id) from transactions.sales_transaction)+ ROW_NUMBER() OVER (ORDER BY value ASC),(select max(Sales_id) from sources.sales),value,(select Employee_id from transactions.login_table where Login_Time = (select max(Login_Time) from transactions.login_table)),(select max(Store_id) from sources.employee_store where Employee_id = (select Employee_id from transactions.login_table where Login_Time = (select max(Login_Time) from transactions.login_table))),@Date_Added" +
					" FROM STRING_SPLIT(@Product_id_combination,',');",
					function (err, rowCount) {
					if (err)
						console.error(err);

					console.log('rowCount: ' + rowCount);
					
					process.exit();
				});

				request.addParameter('Product_id_combination', TYPES.VarChar, Product_id_combination);
				request.addParameter('Payment_type', TYPES.VarChar, Payment_type);
				request.addParameter('Date_Added', TYPES.Date, date_added);
				
				request.on('row', function (columns) {
					console.log('value: ' + columns[0].value);
				});

				connection.execSql(request);
			}
		}
	);
}