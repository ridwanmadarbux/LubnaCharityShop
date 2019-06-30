var x = modify_product1(2000001,function(y){/*console.log(y);*/});

function modify_product1(Product_id,callback)
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
					" WHERE Product_id = @Product_id;",
					function (err, rowCount) {
					if (err)
						console.error(err);

					console.log('rowCount: ' + rowCount);
					
					process.exit();
				});

				request.addParameter('Product_id', TYPES.Int, Product_id);

				request.on('row', function (columns) {
					callback(columns);
				});

				connection.execSql(request);
			}
		}
	);
}