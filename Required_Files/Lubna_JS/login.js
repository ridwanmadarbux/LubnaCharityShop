function login(Employee_id,Entered_Password)
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
				var request = new Request("IF exists (SELECT * FROM sources.employee WHERE Employee_id = @Employee_id AND Login_Password = @Entered_Password)" +
					" BEGIN"+
					" INSERT INTO transactions.login_table (Login_id,Employee_id,Login_Time)" +
					" VALUES ((SELECT max(Login_id)+1 FROM transactions.login_table),@Employee_id,getdate());" +
					" END;", 
					function (err, rowCount) {
					if (err)
						console.error(err);

					console.log('rowCount: ' + rowCount);
					
					process.exit();
				});

				request.addParameter('Employee_id', TYPES.Int, Employee_id);
				request.addParameter('Entered_Password', TYPES.VarChar, Entered_Password);

				request.on('row', function (columns) {
					console.log('value: ' + columns[0].value);
				});

				connection.execSql(request);
			}
		}
	);
}