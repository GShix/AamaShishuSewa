
export const adminSchema = {
  tableName: 'admins',
  fields: {
    id: {
      type: 'UUID',
      primaryKey: true,
      defaultValue: 'gen_random_uuid()',
      description: 'Unique identifier for admin'
    },
    email: {
      type: 'VARCHAR(255)',
      unique: true,
      required: true,
      description: 'Admin email address for login'
    },
    password_hash: {
      type: 'VARCHAR(255)',
      required: true,
      description: 'Bcrypt hashed password'
    },
    full_name: {
      type: 'VARCHAR(255)',
      required: true,
      description: 'Full name of the admin'
    },
    phone: {
      type: 'VARCHAR(15)',
      unique: true,
      required: true,
      description: 'Contact phone number'
    },
    role: {
      type: 'VARCHAR(50)',
      required: true,
      defaultValue: 'admin',
      enum: ['admin', 'superAdmin'],
      description: 'Admin role level'
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
      description: 'URL to admin profile image'
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
  },
  indexes: [
    { fields: ['email'], unique: true },
    { fields: ['phone'], unique: true },
    { fields: ['role'] },
    { fields: ['status'] }
  ],
  relations: []
};

export default adminSchema;
