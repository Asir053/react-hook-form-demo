import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React from "react";
import Select from "@mui/material/Select";
import {useForm, Controller} from "react-hook-form";
import Input from "@material-ui/core/Input";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from "yup";
import useSWR from "swr";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import { useState, useEffect } from "react";
// import Select from "@mui/material/Select";
import "bootstrap/dist/css/bootstrap.min.css";

const schema = yup.object({
    firstName: yup.string().max(10, "Must be 10 characters or less")
        .required(),
    gender: yup.string().required().nullable(),
    occupation: yup.string().required(),

}).required();

export default function Home() {
    const names = [
        { id: 1, value: "Dhaka" },
        { id: 2, value: "Chittagong" },
        { id: 3, value: "Rajshahi" },
        { id: 4, value: "Khulna" },
        { id: 5, value: "Barisal" },
        { id: 6, value: "Sylhet" },
    ];
    const [title, setTitle] = React.useState("delectus aut autem");
    const [personName, setPersonName] = useState(["Dhaka", "Khulna"]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );
    };



    const handleChanges = (e) => {
        console.log(e.target.value);
        setTitle(e.target.value);
    };

    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    // fetch data

    const {data, error} = useSWR(
        "https://jsonplaceholder.typicode.com/todos/",
        fetcher
    );


    const {control, handleSubmit, register, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: '',
            gender: '',
            occupation: '',
            select: {}
        }
    });
    const onSubmit = data => console.log(data);

    if (error) return <div>failed to load</div>;

    if (!data) return <div>loading...</div>;


    return (
        <>
        <h1 className="my-4 font-weight-bold .display-4 text-center">
            Sign Up
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-light container-fluid w-50 d-flex justify-content-center mt-4 pt-4">
            <div className="row d-flex ">
            {/*<TextField  id="standard-basic" label="Standard" variant="standard" {...register('name')}/>*/}


            <Controller
                name="firstName"
                control={control}
                render={({field}) => <Input placeholder="Enter Name" {...field} />}
            />
            <p className="text-danger">{errors.firstName?.message}</p>

                <label>Gender</label>
                <RadioGroup
                    className="d-flex justify-content-center"
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="gender"
                    {...register('gender')}
                >
                    <FormControlLabel name="gender"  value="female" control={<Radio/>} label="Female"/>
                    <FormControlLabel name="gender"  value="male" control={<Radio/>} label="Male"/>
                    <FormControlLabel name="gender" value="other" control={<Radio/>} label="Other"/>
                    {/*<FormControlLabel*/}
                    {/*    value="disabled"*/}
                    {/*    disabled*/}
                    {/*    control={<Radio/>}*/}
                    {/*    label="other"*/}
                    {/*/>*/}
                </RadioGroup>
                <p className="text-danger">{errors.gender?.message}</p>

                <label>Occupation</label>
                <FormGroup name="occupation" row {...register('occupation')} className="d-flex justify-content-center">
                    <FormControlLabel name="occupation" control={<Checkbox />} label="Student" value="Student"/>
                    <FormControlLabel name="occupation" control={<Checkbox/>} label="Employee" value="Employee"/>
                </FormGroup>
                <p className="text-danger">{errors.occupation?.message}</p>

            <Controller
                className="d-flex justify-content-center"
                name="titles"
                control={control}
                render={({select}) => (
                    <Box className="my-3" >
                        <FormControl>
                    <InputLabel id="demo-simple-select-label">TITLE</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={title}
                            row
                            label="TITLE"
                            onChange={handleChanges}
                            {...select}

                        >
                            <MenuItem value="" disabled>Select</MenuItem>
                            {data.map((singledata,i) => (
                                <MenuItem key={i} value={singledata.title}>{singledata.title}</MenuItem>
                            ))}


                        </Select></FormControl></Box>)}
            />


            <Controller
                className="d-flex justify-content-center"
                name="districts"
                control={control}
                render={({multicheck}) => (
                    <Box className="my-3" >
                        <FormControl>
                            <InputLabel id="demo-multiple-checkbox-label">DISTRICT</InputLabel>
                    <Select
                        row
                        name="cbox"
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={personName}
                        onChange={handleChange}
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) => selected.join(", ")}
                        {...multicheck}
                        // MenuProps={MenuProps}
                    >
                        {names.map((name1) => (
                            <MenuItem key={name1.id} value={name1.value}>
                                <Checkbox
                                    checked={
                                        personName.indexOf(name1.value) > -1
                                        // || names[0].value
                                    }
                                />
                                <ListItemText primary={name1.value} />
                            </MenuItem>
                        ))}
                        {console.log(personName)}
                    </Select></FormControl></Box>)}
            />


            {/*<input type="submit" />*/}
            <div className="d-flex justify-content-center"><Button type="submit" value="Submit" variant="contained">Submit</Button></div>
            </div>
        </form>

        </>);
}

