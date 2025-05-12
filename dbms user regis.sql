CREATE TABLE Identification (
    Bio_ID VARCHAR(50) unique PRIMARY KEY,
    name TEXT NOT NULL,
	age INT NOT NULL
);

CREATE TABLE Access_Logs (
    Name VARCHAR(50) unique not null,
	Date VARCHAR(50) not null,
	Time VARCHAR(50) not null,
	Status VARCHAR(50) not null
);
CREATE TABLE location_data (
    Bio_ID varchar(50),
	District varchar(50),
    Residence varchar(50) not null,
	Zone varchar(50) not null,
	primary key(Bio_ID,District),
	foreign key(Bio_ID) references 
	Identification(Bio_ID) 
);
CREATE TABLE Security (
CNIC varchar(50) not null unique
);