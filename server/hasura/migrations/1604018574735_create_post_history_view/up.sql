DROP TRIGGER IF EXISTS post_history_trigger ON cms.post CASCADE;
DROP VIEW IF EXISTS cms.post_history_view;
DROP FUNCTION IF EXISTS post_history_function;

CREATE OR REPLACE FUNCTION post_history_function() RETURNS TRIGGER AS
$post_history_table$
BEGIN
    INSERT INTO cms.post_history(post_id, content, description, title)
    VALUES (new.id, new.content, new.description, new.title);
    RETURN new;
END;
$post_history_table$ LANGUAGE plpgsql;

CREATE TRIGGER post_history_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON cms.post
    FOR EACH ROW
EXECUTE PROCEDURE post_history_function();

CREATE VIEW cms.post_history_view AS
SELECT p.id,
       p.updated_at,
       p.title        AS new_title,
       ph.title       AS old_title,
       p.description  AS new_description,
       ph.description AS old_description,
       p.content      AS new_content,
       ph.content     AS old_content
FROM cms.post p
         FULL OUTER JOIN cms.post_history ph ON p.id = ph.post_id;
