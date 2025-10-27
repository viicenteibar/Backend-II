import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carts' 
    },
    role: {
        type: String,
        default: 'user'
    }
});

// --- Hasheo de contraseña con bcrypt ---
// Usamos un "pre-hook" de Mongoose. Esto se ejecuta ANTES de que un 'save' se complete.
userSchema.pre('save', function(next) {
    // Solo hasheamos la contraseña si ha sido modificada (o es nueva)
    if (!this.isModified('password')) return next();

    // El requisito pide hashSync. 
    // Generamos el salt y hasheamos en un solo paso.
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    next();
});

// --- Método para comparar contraseñas ---
// Añadimos un método al esquema para poder validar la contraseña en el login
userSchema.methods.isValidPassword = function(password) {
    // bcrypt.compareSync compara la contraseña enviada con la hasheada en la DB
    return bcrypt.compareSync(password, this.password);
};

export const UserModel = mongoose.model('User', userSchema);