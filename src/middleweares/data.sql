CREATE DATABASE ummatuz;

CREATE TABLE audios (
    audio_id character varying(100) null,
    title character varying(50) not null,
    info character varying(500) not null,
    link character varying(100) not null, 
    date character varying(4) not null, 
    size float null, 
    category smallint not null
);

CREATE TABLE videos (
    play_list character varying(100) null,
    time_length character varying(10) null,
    video_id character varying(100) null,
    title character varying(500) null,
    imgUrl character varying(200) not null
);

CREATE TABLE playList (
    play_list character varying(100) null,
    category character varying(10) null
);

CREATE TABLE users (
    user_id bigint,
    steep character varying(500),
    is_admin boolean default false
);

CREATE TABLE settings (
    telegram character varying(50) null,
    instagram character varying(100) null,
    youtube character varying(100) null,
    tiktok character varying(100) null,
    faceBook character varying(100) null
);

select 
    p.category,
    v.title,
    v.time_length,
    v.video_id,
    v.imgUrl
from videos as v
left join playList as p on p.play_list = v.play_list;

update users set is_admin = true where user_id = 887528138;

select 
    *
from playList
where category = '4';

delete playlist 
where 

-- 280034232
insert into settings (telegram) values ('ummatuz')
insert into playlist (play_list, category) values ('PLbTAPHpLxwZWPMNau7B6NT-PmOnWtGHiG','4')
insert into audios (title,info,link,date,category,size) values
('📖Фотиҳа сураси','📖Фотиҳа сураси','https://t.me/quran_u/3','2017','1',35),
('📖Бақара сураси','📖Бақара сураси','https://t.me/quran_u/4','2016','1',35),
('📖Имрон сураси','📖Имрон сураси','https://t.me/quran_u/5','2018','1',35),
('📖Нисо сураси','📖Нисо сураси','https://t.me/quran_u/6','2019','1',35),
('📖Маида сураси','📖Маида сураси','https://t.me/quran_u/7','2020','1',35),
('📖Анам сураси','📖Анам сураси','https://t.me/quran_u/8','2021','1',35),
('📖Ароф сураси','📖Ароф сураси','https://t.me/quran_u/9','2022','1',35);