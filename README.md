#  TFG WheFrom

## Author

- Mauro Morán Marcos
- mauro.moranm@udc.es

## Database creation

```
Start Mysql server if not running (e.g. mysqld).

mysqladmin -u root create whefrom -p
mysqladmin -u root create whefromtest -p

mysql -u root -p
    CREATE USER 'whefrom'@'localhost' IDENTIFIED BY 'whefrom';
    GRANT ALL PRIVILEGES ON whefrom.* to 'whefrom'@'localhost' WITH GRANT OPTION;
    GRANT ALL PRIVILEGES ON whefromtest.* to 'whefrom'@'localhost' WITH GRANT OPTION;
    exit
```

## Run

```
cd backend
mvn sql:execute (only first time to create tables)
mvn spring-boot:run

cd frontend
npm install (only first time to download libraries)
npm start
```
