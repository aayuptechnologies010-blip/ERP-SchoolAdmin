import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Avatar, Button, Card, Input } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import { notify } from '../../utils/notify';

export default function Profile() {
  const { user, refreshProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const save = async (e) => { e.preventDefault(); setSaving(true); try { await api.put('/auth/update-profile',{name,phone}); await refreshProfile(); notify.success('Profile updated'); } catch(e){notify.error(e.message)} finally{setSaving(false)} };
  const upload = async (e) => { const file=e.target.files?.[0]; if(!file)return; if(!file.type.startsWith('image/')) return notify.error('Please select an image file'); setUploading(true); try { const fd=new FormData(); fd.append('file',file); const r=await api.post('/uploads',fd,{headers:{'Content-Type':'multipart/form-data'}}); const base=api.defaults.baseURL.replace(/\/api$/,''); await api.put('/auth/update-profile',{avatar:base+r.data.data.url}); await refreshProfile(); notify.success('Photo updated'); } catch(e){notify.error(e.message)} finally{setUploading(false)} };
  return <><Helmet><title>My Profile</title></Helmet><div className="space-y-6 max-w-4xl"><h2 className="text-2xl font-bold">My Profile</h2><div className="grid md:grid-cols-3 gap-6"><Card className="text-center"><Avatar src={user?.avatar} name={user?.name} size="2xl" className="mx-auto mb-4"/><h3 className="text-xl font-bold">{user?.name || 'User'}</h3><p className="text-sm text-erp-muted">{user?.email}</p><p className="text-xs text-erp-muted mt-1 capitalize">{user?.role}</p><label className="mt-4 inline-block btn-outline btn btn-sm cursor-pointer">{uploading?'Uploading...':'Change Photo'}<input type="file" accept="image/*" className="hidden" onChange={upload} disabled={uploading}/></label></Card><Card className="md:col-span-2"><h3 className="section-title mb-4">Personal Details</h3><form onSubmit={save} className="space-y-4"><Input label="Full Name" value={name} onChange={e=>setName(e.target.value)} required/><Input label="Email" value={user?.email||''} disabled/><Input label="Phone" value={phone} onChange={e=>setPhone(e.target.value)}/><Button type="submit" loading={saving}>Save Changes</Button></form></Card></div></div></>;
}
