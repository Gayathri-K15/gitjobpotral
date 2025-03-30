import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch(); // ✅ Moved inside component

    const profile = user?.profile || {};

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        
        

        // New fields
        dob: profile.dob || "",
        address: profile.address || "",

        educationLevel: profile.education?.level || "",
        institution: profile.education?.institution || "",
        yearOfPassout: profile.education?.yearOfPassout || "",
        cgpa: profile.education?.cgpa || "",

        technicalSkills: profile.technicalSkills?.join(", ") || "",
        certifications: profile.certifications?.join(", ") || "",
        honours: profile.honours || "",
        minors: profile.minors || "",

        experience: Array.isArray(profile.experience) ? profile.experience : [],
        company: profile.company || "",
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(input).forEach(key => {
            if (key === "experience") {
                formData.append(key, JSON.stringify(input[key])); // Send experience as JSON
            } else {
                formData.append(key, input[key]);
            }
        });

        

        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error updating profile");
        } finally {
            setLoading(false);
        }
        setOpen(false);
    };

    return (
        <div>
            <Dialog open={open}>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto" onInteractOutside={() => setOpen(false)}>
            <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHandler}>
                        <div className='grid gap-4 py-4'>

                            {/* Personal Info */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="fullname" className="text-right">Name</Label>
                                <Input id="fullname" name="fullname" type="text" value={input.fullname} onChange={changeEventHandler} className="col-span-3" />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input id="email" name="email" type="email" value={input.email} onChange={changeEventHandler} className="col-span-3" />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="phoneNumber" className="text-right">Phone</Label>
                                <Input id="phoneNumber" name="phoneNumber" type="text" value={input.phoneNumber} onChange={changeEventHandler} className="col-span-3" />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="dob" className="text-right">DOB</Label>
                                <Input id="dob" name="dob" type="date" value={input.dob} onChange={changeEventHandler} className="col-span-3" />
                            </div>

                            {/* Address */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="address" className="text-right">Address</Label>
                                <Input id="address" name="address" type="text" value={input.address} onChange={changeEventHandler} className="col-span-3" />
                            </div>

                            

                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="educationLevel" className="text-right">Education Level</Label>
                                <Input id="educationLevel" name="educationLevel" type="text" value={input.educationLevel} onChange={changeEventHandler} className="col-span-3" />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="institution" className="text-right">Institution</Label>
                                <Input id="institution" name="institution" type="text" value={input.institution} onChange={changeEventHandler} className="col-span-3" />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="yearOfPassout" className="text-right">Year of Passout</Label>
                                <Input id="yearOfPassout" name="yearOfPassout" type="text" value={input.yearOfPassout} onChange={changeEventHandler} className="col-span-3" />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="cgpa" className="text-right">CGPA</Label>
                                <Input id="cgpa" name="cgpa" type="text" value={input.cgpa} onChange={changeEventHandler} className="col-span-3" />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="certifications" className="text-right">Certifications</Label>
                                <Input id="certifications" name="certifications" type="text" value={input.certifications} onChange={changeEventHandler} className="col-span-3" />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="technicalSkills" className="text-right">Technical Skills</Label>
                                <Input id="technicalSkills" name="technicalSkills" type="text" value={input.technicalSkills} onChange={changeEventHandler} className="col-span-3" />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="honours" className="text-right">Honours</Label>
                                <Input id="honours" name="honours" type="text" value={input.honours} onChange={changeEventHandler} className="col-span-3" />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="minors" className="text-right">Minors</Label>
                                <Input id="minors" name="minors" type="text" value={input.minors} onChange={changeEventHandler} className="col-span-3" />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="experience" className="text-right">Experience</Label>
                                <Input id="experience" name="experience" type="text" value={input.experience} onChange={changeEventHandler} className="col-span-3" />
                            </div>

                        </div>
                        <DialogFooter>
                            {loading ? (
                                <Button className="w-full my-4">
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full my-4">Update</Button>
                            )}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UpdateProfileDialog;
