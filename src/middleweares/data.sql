CREATE DATABASE ummatuz;

CREATE TABLE audios (
    audio_id int generated always as identity,
    title character varying(50) not null,
    info character varying(100) not null,
    link character varying(100) not null, 
    date character varying(4) not null, 
    size float null, 
    category smallint not null
);
CREATE TABLE videos (
    video_id int generated always as identity,
    title character varying(50) not null,
    info character varying(100) not null,
    link character varying(100) not null, 
    date character varying(4) not null, 
    size float null, 
    category smallint not null
);

CREATE TABLE users (
    user_id bigint,
    steep character varying(500),
    is_admin boolean default false
);

update users set is_admin = true where user_id = 887528138;

insert into audios (title,info,link,date,category,size) values
('📖Фотиҳа сураси','📖Фотиҳа сураси','https://t.me/quran_u/3','2017','1',35),
('📖Бақара сураси','📖Бақара сураси','https://t.me/quran_u/4','2016','1',35),
('📖Имрон сураси','📖Имрон сураси','https://t.me/quran_u/5','2018','1',35),
('📖Нисо сураси','📖Нисо сураси','https://t.me/quran_u/6','2019','1',35),
('📖Маида сураси','📖Маида сураси','https://t.me/quran_u/7','2020','1',35),
('📖Анам сураси','📖Анам сураси','https://t.me/quran_u/8','2021','1',35),
('📖Ароф сураси','📖Ароф сураси','https://t.me/quran_u/9','2022','1',35);