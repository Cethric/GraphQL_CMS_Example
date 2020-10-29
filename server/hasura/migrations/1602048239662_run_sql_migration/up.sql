CREATE OR REPLACE FUNCTION cms.get_permalink(
    post_row cms.Post
) returns text as
$$
select post_row.title || '-' || post_row.published_at
where post_row.published_at is not null
$$
    language Sql
    stable;
