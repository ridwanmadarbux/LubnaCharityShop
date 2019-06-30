var x = perform_sale1("2000000,2000001",function(y){console.log(y);});

function perform_sale1(Product_id_combination,callback)
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
				var request = new Request("SELECT *" +
					" FROM sources.products" +
					" WHERE Product_id in (SELECT value FROM STRING_SPLIT(@Product_id_combination,','));",
					function (err, rowCount) {
					if (err)
						console.error(err);

					console.log('rowCount: ' + rowCount);
					
					process.exit();
				});

				request.addParameter('Product_id_combination', TYPES.VarChar, Product_id_combination);

				request.on('row', function (columns) {
					callback(columns);
				});

				connection.execSql(request);
			}
		}
	);
}