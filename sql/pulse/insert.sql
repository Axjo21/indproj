

INSERT INTO persons
    (email, employee_id, authorization, fornamn, efternamn, telefon)
VALUES
    ('aoj@mail.com', '1000', 'manager', 'Axel', 'Jönsson', '08-221976'),
    ('team-member@mail.com', '1001', 'member', 'Leif', 'GW', '07-432498')
;

INSERT INTO passwords
    (`fk_person`, `password`)
VALUES
    ('aoj@mail.com', '$2b$10$ZvWzaTnCfasPEWBpjOeKRus1f53wXo.8dKP8RE3QpSBSh4IEa6kfO'),
    ('team-member@mail.com', '$2b$10$m78RAoplS8SEHKU1Halsi.o6.KvELqkRKOjIEPY9Ln8iHv8I0n/1G')
;

/*
aoj pass -> 123abc
team-member pass -> abc123
*/

/*DROP TABLE IF EXISTS `persons` ;
CREATE TABLE IF NOT EXISTS `persons` (
    `email` VARCHAR(100) DEFAULT NULL,
    `employee_id` INT NOT NULL,
    `authorization` INT NOT NULL DEFAULT 1,
    `fornamn` VARCHAR(100) DEFAULT NULL,
    `efternamn` VARCHAR(100) DEFAULT NULL,
    `telefon` VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY (`email`)
);

DROP TABLE IF EXISTS `passwords` ;
CREATE TABLE IF NOT EXISTS `passwords` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `fk_person` INT NOT NULL,
    `password` VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY (`id`)
);
*/