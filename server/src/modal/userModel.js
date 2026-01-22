export const userSchema = {
  tableName: 'users',
  fields: {
    id: {
      type: 'UUID',
      primaryKey: true,
      defaultValue: 'gen_random_uuid()',
      description: 'Unique identifier for user'
    },
    email: {
      type: 'VARCHAR(255)',
      unique: true,
      required: true,
      description: 'User email address'
    },
    phone: {
      type: 'VARCHAR(15)',
      unique: true,
      required: true,
      description: 'Contact phone number'
    },
    password_hash: {
      type: 'VARCHAR(255)',
      required: true,
      description: 'Bcrypt hashed password'
    },
    full_name: {
      type: 'VARCHAR(255)',
      required: true,
      description: 'Full name of the user'
    },
    role: {
      type: 'VARCHAR(50)',
      required: true,
      defaultValue: 'user',
      enum: ['user', 'employee'],
      description: 'User role'
    },
    status: {
      type: 'VARCHAR(20)',
      required: true,
      defaultValue: 'active',
      enum: ['active', 'inactive', 'suspended'],
      description: 'Account status'
    },
    profile_image: {
      type: 'TEXT',
      required: false,
      description: 'URL to profile image'
    },
    date_of_birth: {
      type: 'DATE',
      required: false,
      description: 'Date of birth'
    },
    gender: {
      type: 'VARCHAR(20)',
      required: false,
      enum: ['male', 'female', 'other'],
      description: 'Gender'
    },
    address: {
      type: 'TEXT',
      required: false,
      description: 'Physical address'
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      defaultValue: 'NOW()',
      description: 'Account creation timestamp'
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
      defaultValue: 'NOW()',
      description: 'Last update timestamp'
    },
    last_login: {
      type: 'TIMESTAMPTZ',
      required: false,
      description: 'Last successful login timestamp'
    }
  }
};

export default userSchema;
