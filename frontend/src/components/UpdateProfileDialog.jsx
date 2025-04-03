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
    const dispatch = useDispatch();
    const [showEducationForm, setShowEducationForm] = useState(false);
    const [educationList, setEducationList] = useState([]);
    const [newEducation, setNewEducation] = useState({
        level: "",
        institution: "",
        marksScored: "",
        percentage: "",
        yearOfPassout: ""
    });

    const changeEducationHandler = (e) => {
        setNewEducation(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const addEducationHandler = () => {
        if (educationList.length < 4) {
            setEducationList([...educationList, newEducation]);
            setNewEducation({ level: "", institution: "", marksScored: "", percentage: "", yearOfPassout: "" });
        } else {
            toast.error("You can only add up to 4 education levels!");
        }
    };

    const profile = user?.profile || {};

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
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

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(input).forEach(key => {
            if (key === "experience") {
                formData.append(key, JSON.stringify(input[key]));
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
            console.error(error);
            toast.error(error.response?.data?.message || "Error updating profile");
        } finally {
            setLoading(false);
        }
        setOpen(false);
    };

    return (
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto" onInteractOutside={() => setOpen(false)}>
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitHandler}>
                    <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="fullname" className="text-right">Name</Label>
                            <Input id="fullname" name="fullname" type="text" value={input.fullname} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" name="email" type="email" value={input.email} onChange={changeEventHandler} className="col-span-3" />
                        </div>

                        <Button type="button" onClick={() => setShowEducationForm(true)}>Add Education</Button>
                        {showEducationForm && (
                            <div className='p-4 border rounded-md'>
                                <h3 className='mb-2'>Add Education</h3>
                                <Input name="level" placeholder="Education Level" value={newEducation.level} onChange={changeEducationHandler} />
                                <Input name="institution" placeholder="Institution" value={newEducation.institution} onChange={changeEducationHandler} />
                                <Input name="marksScored" placeholder="Marks Scored" value={newEducation.marksScored} onChange={changeEducationHandler} />
                                <Input name="percentage" placeholder="Percentage" value={newEducation.percentage} onChange={changeEducationHandler} />
                                <Input name="yearOfPassout" placeholder="Year of Passout" value={newEducation.yearOfPassout} onChange={changeEducationHandler} />
                                <Button type="button" onClick={addEducationHandler}>Save Education</Button>
                            </div>
                        )}
                        <ul>
                            {educationList.map((edu, index) => (
                                <li key={index}>{edu.level} - {edu.institution} ({edu.yearOfPassout})</li>
                            ))}
                        </ul>
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
    );
};

export default UpdateProfileDialog;

