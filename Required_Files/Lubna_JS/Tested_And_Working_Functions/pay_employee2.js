//var x = pay_employee2(1000002, 3500,"2019-07-01")
//var x = pay_employee2(1000010,3500,"2019-06-28")
//var x = pay_employee2(1000011,4500,"2019-06-28")
//var x = pay_employee2(1000012,2250,"2019-06-28")
//var x = pay_employee2(1000018,2250,"2019-06-28")
//var x = pay_employee2(1000019,2550,"2019-06-28")
//var x = pay_employee2(1000020,2450,"2019-06-28")
//var x = pay_employee2(1000021,2500,"2019-06-28")
//var x = pay_employee2(1000023,2600,"2019-06-28")
//var x = pay_employee2(1000025,2500,"2019-06-28")
//var x = pay_employee2(1000025,2500,"2019-06-28")
//var x = pay_employee2(1000041,2500,"2019-06-28")
//var x = pay_employee2(1000018,3500,"2019-06-21")
//var x = pay_employee2(1000043,2500,"2019-06-28")
//var x = pay_employee2(1000044,2500,"2019-06-28")
//var x = pay_employee2(1000045,2500,"2019-06-28")
//var x = pay_employee2(1000046,2500,"2019-06-28")
//var x = pay_employee2(1000047,2500,"2019-06-28")
//var x = pay_employee2(1000048,2500,"2019-06-28")
//var x = pay_employee2(1000049,2500,"2019-06-28")
//var x = pay_employee2(1000050,2500,"2019-06-28")


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