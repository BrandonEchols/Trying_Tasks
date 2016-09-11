var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString = process.env.DATABASE_URL ? process.env.DATABASE_URL : "postgres://postgres:linked in@localhost:5432/tt_db";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Trying Tasks' });
});

/* GET DataBase. */
/*router.get('/db', function (request, response) {
  pg.connect(connectionString, function(err, client, done) {
    client.query('SELECT * FROM user_table', function(err, result) {
      done();
      if (err)
      { console.error(err); response.send("Error " + err); }
      else {
          response.send(JSON.parse(result.rows));
      }
    });
  });
});*/

/*CHECK LOGIN*/
router.get('/login/:name/p/:password', function(request, response) {
    pg.connect(connectionString, function(err, client, done) {
        client.query("SELECT * FROM user_table WHERE name = '" + request.params.name + "' AND password = '" + request.params.password + "';",
            function(err, result) {
            done();
            if (err)
            { console.error(err); response.send("Error " + err); }
            else {
                response.send(JSON.stringify(result.rows));
            }
        });
    });
});

/*CHECK FOR EXISTING LOGIN*/
router.get('/checkForLogin/:name', function(request, response) {
    var query = "SELECT * FROM user_table WHERE name = '" + request.params.name + "';";
    pg.connect(connectionString, function(err, client, done) {
        client.query(query, function(err, result) {
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else {
                response.send(JSON.stringify(result.rows));
            }
        });
    });
});

/*CREATE LOGIN*/
router.get('/createLogin/:name/p/:password', function(request, response) {
    var query = "INSERT INTO user_table(name, password) " +
        "VALUES('" + request.params.name + "', '" + request.params.password + "');";
    pg.connect(connectionString, function(err, client, done) {
        client.query(query, function(err, result) {
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else {
                response.send(JSON.stringify(result.rows));
            }
        });
    });
});

/*DELETE LOGIN*/
router.get('/deleteLogin/:name', function(request, response) {
    var query = "DELETE FROM user_table WHERE name = '" + request.params.name + "';";
    pg.connect(connectionString, function(err, client, done) {
        client.query(query, function(err, result) {
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else {
                response.send(JSON.stringify(result.rows));
            }
        });
    });
});

/*CREATE TASK*/
router.get('/createTask/:name/d/:desc', function(request, response) {
    var query = "INSERT INTO task_table(user_id, description, completed) " +
                "VALUES((SELECT id FROM user_table WHERE name = '" + request.params.name +
                "'), '" + request.params.desc + "', false);";
    pg.connect(connectionString, function(err, client, done) {
        client.query(query, function(err, result) {
                done();
                if (err) {
                    console.error(err); response.send("Error " + err);
                }
                else {
                    response.send(JSON.stringify(result.rows));
                }
            });
    });
});

/*RETRIEVE ALL TASKS FOR USER*/
router.get('/gettasks/:name', function(request, response) {
    var name = request.params.name;
    pg.connect(connectionString, function(err, client, done) {
        client.query("SELECT description, completed FROM task_table WHERE user_id = (SELECT id FROM user_table WHERE name = '" + name + "');",
            function(err, result) {
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else {
                response.send(JSON.stringify(result.rows));
            }
        });
    });
});

/*UPDATE TASK*/
router.get('/updateTask/:name/d/:desc/c/:comp', function(request, response) {
    var query = "UPDATE task_table SET completed = '" + request.params.comp +
                "' WHERE user_id = (SELECT id FROM user_table WHERE name = '" + request.params.name + "') " +
                "AND description = '" + request.params.desc + "';";
    pg.connect(connectionString, function(err, client, done) {
        client.query(query, function(err, result) {
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            }
        });
    });
});

/*DELETE TASK*/
router.get('/deleteTask/:name/d/:desc', function(request, response) {
    var query = "DELETE FROM task_table WHERE user_id = (SELECT id FROM user_table WHERE name = '" + request.params.name + "') " +
                "AND description = '" + request.params.desc + "';";
    pg.connect(connectionString, function(err, client, done) {
        client.query(query, function(err, result) {
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else {
                response.send(JSON.stringify(result.rows));
            }
        });
    });
});

module.exports = router;
