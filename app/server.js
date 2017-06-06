let express = require('express'),
    app = express(),
    path = require('path'),
    pg = require('pg'),
    helmet = require('helmet'),
    morgan = require('morgan'),
    bp = require('body-parser');

//Connecting to pg
let conString = "postgres://nlnycdshfdgcdj:3c2fc11d1b38f1851249476628c40bec880907683a32745c8686f1abe0298543@ec2-54-225-68-71.compute-1.amazonaws.com:5432/d8dsrpplqvgv58";

let port = process.env.PORT || 80;


//Configuring Express
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bp.json());
app.use(bp.urlencoded({extended: false}));
app.use(helmet());
app.use(morgan('tiny'));


app.get('/', (req, res)=>{

    //PG connect
    pg.connect(conString,(err, client, done)=>{

        if(err){
            return console.error('error fetching info', err);
        }

        client.query(`SELECT * FROM recipes`, (err, result)=>{

            if(err){
                return console.error('error running query', err);
            }
            res.render('index', {
                recipes: result.rows
            });
            done();

        })
    });

});

app.post('/add', (req, res)=>{

    //PG connect
    pg.connect(conString,(err, client, done)=>{

        if(err){
            return console.error('error fetching info', err);
        }

        client.query(`INSERT INTO recipes(name, ingredients, directions)
                     VALUES($1, $2, $3)`
            , [req.body.name, req.body.ingredients, req.body.directions]);

        done();
        res.redirect('/');
    });

});

app.delete('/delete/:id', (req, res)=>{

    //PG connect
    pg.connect(conString,(err, client, done)=>{

        if(err){
            return console.error('error fetching info', err);
        }

        client.query(`DELETE from recipes WHERE id = $1`
            , [req.params.id]);

        done();
        res.send(200);
    });

});

app.post('/edit', (req, res)=>{

//PG connect
    pg.connect(conString,(err, client, done)=>{

        if(err){
            return console.error('error fetching info', err);
        }

        client.query(`UPDATE recipes SET name=$1, ingredients=$2, directions=$3 WHERE id=$4`
            , [req.body.name, req.body.ingredients, req.body.directions, req.body.id ]);

        done();
        res.redirect('/');
    });


});

app.listen(port, ()=>{
    console.log(`listening ${port}`);
});
