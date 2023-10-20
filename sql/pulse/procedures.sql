
-- DISPLAY ALL USERS
DROP PROCEDURE IF EXISTS show_persons;
DELIMITER ;;
CREATE PROCEDURE show_persons()
BEGIN
    SELECT * FROM persons;
END
;;
DELIMITER ;

-- DISPLAY ALL MEMBERS
DROP PROCEDURE IF EXISTS show_members;
DELIMITER ;;
CREATE PROCEDURE show_members(
    p_search VARCHAR(100)
)
BEGIN
    SELECT 
        * 
    FROM 
        persons
    WHERE
        authorization LIKE p_search
    ;
END
;;
DELIMITER ;


-- CREATE NEW PROJECT
DROP PROCEDURE IF EXISTS create_project;
DELIMITER ;;
CREATE PROCEDURE create_project(
    p_name VARCHAR(100),
    p_summary VARCHAR(100),
    p_start DATE,
    p_end DATE
)
BEGIN
    INSERT INTO
        projects (`name`, `summary`, `start`, `end`)
    VALUES
        (p_name, p_summary, p_start, p_end)
    ;
END
;;
DELIMITER ;

-- ASSIGN MEMBERS TO PROJECT
DROP PROCEDURE IF EXISTS assign_members;
DELIMITER ;;
CREATE PROCEDURE assign_members(
    p_project VARCHAR(100),
    p_member VARCHAR(100)
)
BEGIN
    INSERT INTO
        project_members (`fk_project`, `fk_person`)
    VALUES
        (p_project, p_member)
    ;
END
;;
DELIMITER ;


-- DISPLAY COMPLETE DATA FROM PROJECT
-- "separator" på group_concat verkar inte göra ngn skillnad
-- funkar tills vidare.
DROP PROCEDURE IF EXISTS view_project;
DELIMITER ;;
CREATE PROCEDURE view_project(
    p_name VARCHAR(100)
)
BEGIN
    SELECT 
        proj.name AS `name`,
        proj.summary AS `summary`,
        GROUP_CONCAT(m.fk_person SEPARATOR ' | ') AS `members`,
        proj.start AS `start`,
        proj.end AS `end`
    FROM projects AS proj
        JOIN project_members AS m
            ON m.fk_project = proj.name
    WHERE
        proj.name = p_name
    ;
END
;;
DELIMITER ;



--SHOW WARNINGS;
-- ASSIGN PASSWORD TO NEW MEMBER
DROP PROCEDURE IF EXISTS assign_password;
DELIMITER ;;
CREATE PROCEDURE assign_password(
    p_id VARCHAR(100),
    p_password VARCHAR(100)
)
BEGIN
    INSERT INTO
        passwords (`fk_person`, `password`)
    VALUES
        (p_id, p_password)
    ;
END
;;
DELIMITER ;


-- AUTHENTICATE LOGIN, UNUSED? 
DROP PROCEDURE IF EXISTS authenticate_login;
DELIMITER ;;
CREATE PROCEDURE authenticate_login(
    p_id VARCHAR(100)
)
BEGIN
    SELECT
        password
    FROM 
        passwords
    WHERE
        fk_person LIKE p_id
    ;
END
;;
DELIMITER ;

-- GET USERS ROLE, UNUSED?
DROP PROCEDURE IF EXISTS get_user_role;
DELIMITER ;;
CREATE PROCEDURE get_user_role(
    p_id VARCHAR(100)
)
BEGIN
    SELECT
        authorization
    FROM 
        persons
    WHERE
        email LIKE p_id
    ;
END
;;
DELIMITER ;



-- CREATE NEW REPORT
DROP PROCEDURE IF EXISTS create_report;
DELIMITER ;;
CREATE PROCEDURE create_report(
    p_person VARCHAR(100),
    p_project VARCHAR(100),
    p_deadline DATE
)
BEGIN
    INSERT INTO
        reports (`fk_person`, `fk_project`, `deadline`)
    VALUES
        (p_person, p_project, p_deadline)
    ;
END
;;
DELIMITER ;



-- VIEW ALL REPORTS
DROP PROCEDURE IF EXISTS view_all_reports;
DELIMITER ;;
CREATE PROCEDURE view_all_reports()
BEGIN
    SELECT
        id,
        fk_person AS `member`,
        fk_project AS `project`,
        DATE_FORMAT(deadline, "%Y-%m-%d") AS `deadline`,
        `status`,
        content
    FROM 
        reports
    ;
END
;;
DELIMITER ;


-- VIEW MEMBERS REPORTS
DROP PROCEDURE IF EXISTS view_my_reports;
DELIMITER ;;
CREATE PROCEDURE view_my_reports(
    p_email VARCHAR(100)
)
BEGIN
    SELECT
        id,
        fk_person AS `member`,
        fk_project AS `project`,
        DATE_FORMAT(deadline, "%Y-%m-%d") AS `deadline`,
        `status`,
        content
    FROM 
        reports
    WHERE
        fk_person LIKE p_email
    ;
END
;;
DELIMITER ;

-- VIEW MEMBERS REPORTS
DROP PROCEDURE IF EXISTS view_single_report;
DELIMITER ;;
CREATE PROCEDURE view_single_report(
    p_id INT
)
BEGIN
    SELECT
        id,
        fk_person AS `member`,
        fk_project AS `project`,
        DATE_FORMAT(deadline, "%Y-%m-%d") AS `deadline`,
        `status`,
        content,
        comment
    FROM 
        reports
    WHERE
        id LIKE p_id
    ;
END
;;
DELIMITER ;


-- CREATE NEW PROJECT
DROP PROCEDURE IF EXISTS submit_report;
DELIMITER ;;
CREATE PROCEDURE submit_report(
    p_id INT,
    p_status VARCHAR(100),
    p_content VARCHAR(10000)
)
BEGIN
    UPDATE reports
    SET 
        status = p_status, content = p_content
    WHERE
        id LIKE p_id
    ;
END
;;
DELIMITER ;


-- CREATE NEW PROJECT
DROP PROCEDURE IF EXISTS report_owner;
DELIMITER ;;
CREATE PROCEDURE report_owner(
    p_id VARCHAR(100)
)
BEGIN
    SELECT 
        fk_person
    FROM 
        reports
    WHERE
        id LIKE p_id
    ;
END
;;
DELIMITER ;
