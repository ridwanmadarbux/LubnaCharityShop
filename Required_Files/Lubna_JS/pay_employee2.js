function pay_employee2(Employee_id, Amount_Paid, date_added)
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
				var request = new Request("INSERT INTO transactions.salary_transaction" +
					" (Salary_id,Employee_id,Amount_Paid,Date_of_transaction)" +
					"VALUES" +
					" ((select max(Salary_id)+1 from transactions.salary_transaction),@Employee_id,@Amount_Paid,@Date_Added);", 
					function (err, rowCount) {
					if (err)
						console.error(err);

					console.log('rowCount: ' + rowCount);
					
					//release the connection back to the pool when finished
					//connection.release();
					process.exit();
				});

				request.addParameter('Employee_id', TYPES.Int, Employee_id);
				request.addParameter('Amount_Paid', TYPES.Money, Amount_Paid);
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