CREATE DATABASE ummatuz;

CREATE TABLE audios (
    audio_id int generated always as identity,
    title character varying(30) not null,
    info character varying(50) not null,
    link character varying(50) not null, 
    date character varying(4) not null, 
    category smallint not null
);
CREATE TABLE videos (
    video_id int generated always as identity,
    title character varying(30) not null,
    info character varying(50) not null,
    link character varying(50) not null, 
    date character varying(4) not null, 
    category smallint not null
);

CREATE TABLE users (
    user_id bigint,
    steep character varying(500)
);

insert into audios (title,info,link,date,category) values
('📖Фотиҳа сураси','📖Фотиҳа сураси','https://t.me/quran_u/3','2017','1'),
('📖Бақара сураси','📖Бақара сураси','https://t.me/quran_u/4','2016','1'),
('📖Имрон сураси','📖Имрон сураси','https://t.me/quran_u/5','2018','1'),
('📖Нисо сураси','📖Нисо сураси','https://t.me/quran_u/6','2019','1'),
('📖Маида сураси','📖Маида сураси','https://t.me/quran_u/7','2020','1'),
('📖Анам сураси','📖Анам сураси','https://t.me/quran_u/8','2021','1'),
('📖Ароф сураси','📖Ароф сураси','https://t.me/quran_u/9','2022','1');