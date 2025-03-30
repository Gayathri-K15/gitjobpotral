import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, Calendar } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                {/* Profile Info */}
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg" alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                            <p>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline"><Pen /></Button>
                </div>

                {/* Contact Details */}
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Calendar />
                        <span>{user?.profile?.dob || "NA"}</span>
                    </div>
                </div>

                {/* Address */}
                <div className='my-5'>
                    <h1 className='font-bold text-lg'>Address</h1>
                    <p>{user?.profile?.address || "NA"}</p>
                </div>

                {/* Experience */}
                <div className='my-5'>
                    <h1 className='font-bold text-lg'>Experience</h1>
                    <ul>
                        {user?.profile?.experience?.length > 0
                            ? user?.profile?.experience.map((exp, index) => (
                                <li key={index}>
                                    <strong>{exp.company}</strong> - {exp.role} ({exp.years} years)
                                </li>
                              ))
                            : <span>NA</span>}
                    </ul>
                </div>

                {/* Education Details */}
                <div className='my-5'>
                    <h1 className='font-bold text-lg'>Education</h1>
                    <p><strong>Level:</strong> {user?.profile?.educationLevel || "NA"}</p>
                    <p><strong>Institution:</strong> {user?.profile?.institution || "NA"}</p>
                    <p><strong>Year of Passout:</strong> {user?.profile?.yearOfPassout || "NA"}</p>
                    <p><strong>CGPA:</strong> {user?.profile?.cgpa || "NA"}</p>
                </div>

                {/* Skills */}
                <div className='my-5'>
                    <h1 className='font-bold text-lg'>Technical Skills</h1>
                    <div className='flex items-center gap-1'>
                        {user?.profile?.technicalSkills?.length > 0
                            ? user?.profile?.technicalSkills.map((skill, index) => <Badge key={index}>{skill}</Badge>)
                            : <span>NA</span>}
                    </div>
                </div>

                {/* Certifications */}
                <div className='my-5'>
                    <h1 className='font-bold text-lg'>Certifications</h1>
                    <ul>
                        {user?.profile?.certifications?.length > 0
                            ? user?.profile?.certifications.map((cert, index) => <li key={index}>• {cert}</li>)
                            : <span>NA</span>}
                    </ul>
                </div>

                {/* Honours & Minors */}
                <div className='my-5'>
                    <h1 className='font-bold text-lg'>Honours & Minors</h1>
                    <p><strong>Honours:</strong> {user?.profile?.honours || "NA"}</p>
                    <p><strong>Minors:</strong> {user?.profile?.minors || "NA"}</p>
                </div>

                {/* Resume Upload */}
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {isResume
                        ? <a target='blank' href={user?.profile?.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>{user?.profile?.resumeOriginalName}</a>
                        : <span>NA</span>}
                </div>
            </div>

            {/* Applied Jobs */}
            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>

            {/* Profile Update Dialog */}
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile;
