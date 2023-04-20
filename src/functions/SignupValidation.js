export const isValidName = (name) => {
    // Add your validation rules for the name, e.g., minimum length, allowed characters, etc.
    return name.trim().length >= 3;
};
export const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10,15}$/;
    return phoneRegex.test(phoneNumber);
};

export const isValidEmail = (email) => {
    // A simple regex to validate email addresses
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
};

export const isValidPassword = (password) => {
    // Add your validation rules for the password, e.g., minimum length, required characters, etc.
    return password.trim().length >= 6;
};
export const doPasswordsMatch = (password, confirmPassword) => {
    return password === confirmPassword;
};


