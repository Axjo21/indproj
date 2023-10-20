
-- Schema eshop
DROP DATABASE IF EXISTS `pulse`;
-- Schema shop
CREATE DATABASE IF NOT EXISTS `pulse`;
USE `pulse`;


-- USERS (managers & members)
DROP TABLE IF EXISTS `persons` ;
CREATE TABLE IF NOT EXISTS `persons` (
    `email` VARCHAR(100) NOT NULL,
    `employee_id` INT NOT NULL,
    `authorization` VARCHAR(100) DEFAULT 'member',
    `fornamn` VARCHAR(100) DEFAULT NULL,
    `efternamn` VARCHAR(100) DEFAULT NULL,
    `telefon` VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY (`email`)
);

-- PASSWORDS
DROP TABLE IF EXISTS `passwords` ;
CREATE TABLE IF NOT EXISTS `passwords` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `fk_person` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY (`id`)
);


-- PROJECTS
DROP TABLE IF EXISTS `projects` ;
CREATE TABLE IF NOT EXISTS `projects` (
    `name` VARCHAR(100) NOT NULL,
    `summary` VARCHAR(100) DEFAULT NULL,
    `start` DATE,
    `end` DATE,
    PRIMARY KEY (`name`)
);

-- REPORTS
DROP TABLE IF EXISTS `reports` ;
CREATE TABLE IF NOT EXISTS `reports` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `fk_person` VARCHAR(100) NOT NULL,
    `fk_project` VARCHAR(100) NOT NULL,
    `deadline` DATE,
    `status`VARCHAR(100) DEFAULT 'Pending',
    `content` VARCHAR(10000) DEFAULT "",
    `comment` VARCHAR(100) DEFAULT "",
    PRIMARY KEY (`id`)
);



-- PROJECT-MEMBERS
-- här skulle jag kunna skapa en GROUP_CONCAT
-- sedan när jag visar ? 
DROP TABLE IF EXISTS `project_members` ;
CREATE TABLE IF NOT EXISTS `project_members` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `fk_project` VARCHAR(100) NOT NULL,
    `fk_person` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`)
);


-- fk for passwords
ALTER TABLE `reports`
ADD FOREIGN KEY IF NOT EXISTS (`fk_person`)
REFERENCES `persons` (`email`),
ADD FOREIGN KEY IF NOT EXISTS (`fk_project`)
REFERENCES `projects` (`name`);



-- fk for passwords
ALTER TABLE `passwords`
ADD FOREIGN KEY IF NOT EXISTS (`fk_person`)
REFERENCES `persons` (`email`);


-- fk for project_members
ALTER TABLE `project_members`
ADD FOREIGN KEY IF NOT EXISTS (`fk_person`)
REFERENCES `persons` (`email`),
ADD FOREIGN KEY IF NOT EXISTS (`fk_project`)
REFERENCES `projects` (`name`);
