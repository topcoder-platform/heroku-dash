 /*
 select count(distinct u.resource_id), count(s.submission_id) from tcs_catalog:project p
 inner join tcs_catalog:upload u on u.project_id = p.project_id  and upload_status_id = 1
        and upload_Type_id = 1
         inner join tcs_catalog:submission s on s.upload_id =u.upload_id --and initial_score>0
 where   p.project_id = REPLACEME
*/

/*** submissions ****/
@export on;
@export set filename="PATHREPLACE/challenge-submissions.mess";


select
"{""user"":{""rating"":"""|| NVL(rating, "")
 || """,""handle"":""" || handle  || """,""country"":""" || NVL(country_name,"No Country Specified")
   || """,""countryFlag"":""/i/" || nvl(lower(iso_alpha2_code),"none") || "-flag.png""" || ",""avatar"":"""
||  NVL(path.path||file_name, "")  || """},""submissions"":""" || nvl(submission_id,0) || """,""timestamp"":""" ||
Month(u.create_date) || '-' ||
Day(u.create_date) || '-' ||
YEAR(u.create_date)
|| """,""rank"":""" || nvl(initial_score,nvl(initial_Score,"")) || """,""points"":""" ||nvl(initial_score,"")
|| """,""submissionid"":""" || submission_id
|| """},"
from tcs_catalog:project p
  inner join tcs_catalog:resource r on r.project_id = p.project_id and resource_Role_id = 1
  inner join tcs_catalog:upload upload on upload.project_id = p.project_id and upload.resource_id = r.resource_id and upload.upload_status_id = 1
          and upload.upload_Type_id = 1 and upload.upload_id = (select max(upload_id) --and upload.create_date >= MDY(3,15,2020)
  from tcs_catalog:upload upload2
   where upload2.project_id = p.project_id and upload2.resource_id = r.resource_id and upload2.upload_status_id = 1
          and upload2.upload_Type_id = 1)
  left outer join tcs_catalog:submission s on s.upload_id =upload.upload_id
  inner join coder on coder.coder_id = r.user_id
  inner join user u on u.user_id = coder.coder_id and handle != 'TonyJ'
  left outer join country c on c.country_code = coder.comp_country_code
left outer join coder_image_xref cix on cix.coder_id = u.user_id and display_flag =1
left outer join image i on cix.image_id = i.image_id and image_type_id = 1
left outer join path path on path.path_id = i.path_id
left outer join algo_rating ar  on ar.coder_id = u.user_id and algo_rating_Type_id = 3
where p.project_id = REPLACEME and handle not in ( "MarathonTester1", "MarathonTester2", "MarathonTester3") ;



@export off;





/**** geography ****/


@export on;
@export set filename="PATHREPLACE/geo-data.mess" CsvColumnDelimiter=",";

select "{""country"":""" || NVL(country_name,"No Country Specified")
   || """,""code"":"""||  nvl(lower(iso_alpha2_code),"none") || """,""submissions"":",  count(u.upload_Id) , "},"
  from tcs_catalog:project p
  inner join tcs_catalog:resource r on r.project_id = p.project_id and resource_Role_id = 1
  inner join tcs_catalog:upload u on u.project_id = p.project_id and u.resource_id = r.resource_id and upload_status_id = 1
          and upload_Type_id = 1 and  u.create_date >= MDY(3,15,2020)
  --inner join tcs_catalog:submission s on s.upload_id =u.upload_id and initial_score>0
  inner join coder on coder.coder_id = r.user_id
  left outer join country c on c.country_code = coder.comp_country_code
where p.project_id = REPLACEME
group by 1;

@export off;

/**** participants ****/
@export on;
@export set filename="PATHREPLACE/challenge-participants.mess" CsvColumnDelimiter=",";
select  "{""user"":{""rating"":"""|| NVL(rating, "")
 || """,""handle"":""" ||  handle
|| """,""country"":""" || NVL(country_name,"No Country Specified")
|| """,""countryFlag"":""/i/" || nvl(lower(iso_alpha2_code),"none") || "-flag.png"""
 || ",""avatar"":""" ||  NVL(path||file_name, "")
|| """},""registrationDate"":""" || Month(r.create_date) || '-' ||
Day(r.create_date) || '-' ||
YEAR(r.create_date)
|| """,""submissions"":""" ||nvl(submission_id,0)
||  """,""language"":"""
|| """,""scoreRank"":""" || nvl(initial_Score,nvl(initial_Score,""))
|| """,""points"":""" ||nvl(initial_Score,"") || """},"
from tcs_catalog:project p
  inner join tcs_catalog:resource r on r.project_id = p.project_id and resource_Role_id = 1
  left outer join tcs_catalog:upload upload on upload.project_id = p.project_id and upload.resource_id = r.resource_id and upload.upload_status_id = 1
          and upload.upload_Type_id = 1 and upload.upload_id = (select max(upload_id) --and upload.create_date >= MDY(3,15,2020)
  from tcs_catalog:upload upload2
   where upload2.project_id = p.project_id and upload2.resource_id = r.resource_id and upload2.upload_status_id = 1
          and upload2.upload_Type_id = 1)
  left outer join tcs_catalog:submission s on s.upload_id =upload.upload_id
  inner join coder on coder.coder_id = r.user_id
  inner join user u on u.user_id = coder.coder_id and handle != 'TonyJ'
  left outer join country c on c.country_code = coder.comp_country_code
left outer join coder_image_xref cix on cix.coder_id = u.user_id and display_flag =1
left outer join image i on cix.image_id = i.image_id and image_type_id = 1
left outer join path path on path.path_id = i.path_id
left outer join algo_rating ar  on ar.coder_id = u.user_id and algo_rating_Type_id = 3
where p.project_id = REPLACEME and handle not in ( "MarathonTester1", "MarathonTester2", "MarathonTester3") ;



@export off;

/*** graph data ***/

@export on;
@export set filename="PATHREPLACE/graph-data.csv" CsvColumnDelimiter=",";


 select   rating,handle,nvl(country_name,"No Country Specified"), NVL(path.path||file_name, "") avatar,
to_char(s.create_date, '%Y-%m-%dT%H:%M:%S') submittime,
 nvl(initial_score,"0"),
  member_since
 from tcs_catalog:project p
  inner join tcs_catalog:resource r on r.project_id = p.project_id and resource_Role_id = 1
  inner join tcs_catalog:upload upload on upload.project_id = p.project_id and upload.resource_id = r.resource_id and upload.upload_status_id = 1
          and upload.upload_Type_id = 1 and upload.create_date >= MDY(3,15,2020)
  inner join tcs_catalog:submission s on s.upload_id =upload.upload_id and s.create_date >= MDY(3,15,2020)
  inner join coder on coder.coder_id = r.user_id
  inner join user u on u.user_id = coder.coder_id and handle != 'TonyJ'
  left outer join country c on c.country_code = coder.comp_country_code
left outer join coder_image_xref cix on cix.coder_id = u.user_id and display_flag =1
left outer join image i on cix.image_id = i.image_id and image_type_id = 1
left outer join path path on path.path_id = i.path_id
left outer join algo_rating ar  on ar.coder_id = u.user_id and algo_rating_Type_id = 3
where p.project_id = REPLACEME and handle not in ( "MarathonTester1", "MarathonTester2", "MarathonTester3") ;
order by handle;
@export off;

/**** challenge status ***/

@export on;
@export set filename="PATHREPLACE/challenge-status.csv" CsvColumnDelimiter=",";
select  count(unique coder.coder_id), count(s.submission_id),0
from tcs_catalog:project p
  inner join tcs_catalog:resource r on r.project_id = p.project_id and resource_Role_id = 1
  inner join tcs_catalog:upload upload on upload.project_id = p.project_id and upload.resource_id = r.resource_id and upload.upload_status_id = 1
          and upload.upload_Type_id = 1 and upload.create_date >= MDY(3,15,2020)
  inner join tcs_catalog:submission s on s.upload_id =upload.upload_id
  inner join coder on coder.coder_id = r.user_id
  inner join user u on u.user_id = coder.coder_id and handle != 'TonyJ'
  left outer join country c on c.country_code = coder.comp_country_code
left outer join coder_image_xref cix on cix.coder_id = u.user_id and display_flag =1
left outer join image i on cix.image_id = i.image_id and image_type_id = 1
left outer join path path on path.path_id = i.path_id
left outer join algo_rating ar  on ar.coder_id = u.user_id and algo_rating_Type_id = 3
where p.project_id = REPLACEME
Union
select  0,0,count(coder.coder_id)
from tcs_catalog:project p
  inner join tcs_catalog:resource r on r.project_id = p.project_id and resource_Role_id = 1
  inner join coder on coder.coder_id = r.user_id
  inner join user u on u.user_id = coder.coder_id and handle != 'TonyJ'
  left outer join country c on c.country_code = coder.comp_country_code
left outer join coder_image_xref cix on cix.coder_id = u.user_id and display_flag =1
left outer join image i on cix.image_id = i.image_id and image_type_id = 1
left outer join path path on path.path_id = i.path_id
left outer join algo_rating ar  on ar.coder_id = u.user_id and algo_rating_Type_id = 3
where p.project_id = REPLACEME;


@export off;



/**** PARTICIPANTS ****/
@export on;
@export set filename="PATHREPLACE/challenge-participants.csv" CsvColumnDelimiter=",";
select   NVL(rating, "") rating,
  handle,
  --address email,
   NVL(country_name,"No Country Specified") country,
  NVL(path.path||file_name, "") avatar,
 r.create_date challengeRegDate,
 nvl(submission_id,0) submissionNumber,
  nvl("", "") language,
  nvl(final_score, initial_score) final_score,
  user_rank placement, -- nvl(lcr.placed,nvl(ls.submission_points,"")) submissionPoints,
  nvl(initial_Score,"") provisionalPoints,
  member_since joinedTopcoderDate
from tcs_catalog:project p
  inner join tcs_catalog:resource r on r.project_id = p.project_id and resource_Role_id = 1
  inner join tcs_catalog:upload upload on upload.project_id = p.project_id and upload.resource_id = r.resource_id and upload.upload_status_id = 1
          and upload.upload_Type_id = 1 and upload.create_date >= MDY(3,15,2020)
  inner join tcs_catalog:submission s on s.upload_id =upload.upload_id
  inner join coder on coder.coder_id = r.user_id
  inner join user u on u.user_id = coder.coder_id and u.handle != 'TonyJ'
  left outer join country c on c.country_code = coder.comp_country_code
left outer join coder_image_xref cix on cix.coder_id = u.user_id and display_flag =1
left outer join image i on cix.image_id = i.image_id and image_type_id = 1
left outer join path path on path.path_id = i.path_id
left outer join algo_rating ar  on ar.coder_id = u.user_id and algo_rating_Type_id = 3
where p.project_id = REPLACEME and handle not in ( "MarathonTester1", "MarathonTester2", "MarathonTester3") ;

@export off;
