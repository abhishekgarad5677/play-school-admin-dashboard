import React, { useContext, useEffect, useState } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
} from "@mui/material";
import { UserContext } from "../../utils/UserContext";


export const EditUser = (props) => {

    const { open, handleClose, userData } = props;


    const { allUsersData, updatedUserList } = useContext(UserContext);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        id: null,
        fullName: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (userData) {
            setFormData({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                role: userData.role,
                id: userData.id,
            })
        }
    }, [userData])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.firstName) tempErrors.firstName = "First Name is required";
        if (!formData.lastName) tempErrors.lastName = "Last Name is required";
        if (!formData.email) {
            tempErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = "Email is not valid";
        }
        if (!formData.role) tempErrors.role = "Role is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const newObj = {
                ...formData,
                fullName: formData.firstName + " " + formData.lastName,
            };
            const updatedArray = allUsersData.map((item) =>
                item.id === formData.id ? newObj : item
            );
            console.log("updated user array", updatedArray);
            updatedUserList(updatedArray)
            handleClose(); // Close the modal on successful submission
        }
    };

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        borderRadius: "8px",
        boxShadow: 24,
        p: 4,
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography mb={2} id="modal-modal-title" variant="h6" fontWeight="600" component="h2">
                        Edit User Information
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            id="firstName"
                            label="First Name"
                            variant="outlined"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            variant="outlined"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            id="email"
                            label="Email"
                            variant="outlined"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal" error={!!errors.role}>
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                                labelId="role-label"
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                label='Role'
                            >
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="Editor">Editor</MenuItem>
                                <MenuItem value="Viewer">Viewer</MenuItem>
                            </Select>
                            <FormHelperText>{errors.role}</FormHelperText>
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3 }}
                        >
                            Save Changes
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}