export const selectFields="id,type,title,description,image_key AS imageKey,start_date AS startDate,end_date AS endDate,active,button_text AS buttonText,button_url AS buttonUrl,created_at AS createdAt,updated_at AS updatedAt";
export const normalized=(row)=>({...row,active:Boolean(row.active),imageUrl:row.imageKey?`/api/images/${encodeURIComponent(row.imageKey)}`:""});
export async function byId(db,id){return db.prepare(`SELECT ${selectFields} FROM publications WHERE id=?`).bind(id).first();}
