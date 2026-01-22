export const employeeSchema = {
  tableName: 'employees',
  fields: {
    id: {
      type: 'UUID',
      primaryKey: true,
      defaultValue: 'gen_random_uuid()',
      description: 'Unique identifier for employee'
    },
    full_name: {
      type: 'VARCHAR(255)',
      required: true,
      description: 'Full name of the employee'
    },
    email: {
      type: 'VARCHAR(255)',
      unique: true,
      required: true,
      description: 'Email address'
    },
    phone: {
      type: 'VARCHAR(15)',
      unique: true,
      required: true,
      description: 'Contact phone number'
    },
    specialization: {
      type: 'VARCHAR(255)',
      required: true,
      description: 'Area of specialization (e.g., Midwife, Nurse, Lactation Consultant)'
    },
    experience: {
      type: 'INTEGER',
      required: false,
      defaultValue: 0,
      description: 'Years of experience'
    },
    qualification: {
      type: 'TEXT',
      required: false,
      description: 'Educational qualifications'
    },
    license_number: {
      type: 'VARCHAR(100)',
      required: false,
      description: 'Employee license number'
    },
    address: {
      type: 'TEXT',
      required: false,
      description: 'Physical address'
    },
    bio: {
      type: 'TEXT',
      required: false,
      description: 'Employee biography'
    },
    hourly_rate: {
      type: 'DECIMAL(10,2)',
      required: false,
      defaultValue: 0,
      description: 'Hourly rate charge'
    },
    rating: {
      type: 'DECIMAL(3,2)',
      required: false,
      defaultValue: 0,
      description: 'Average rating (0-5)'
    },
    total_reviews: {
      type: 'INTEGER',
      required: false,
      defaultValue: 0,
      description: 'Total number of reviews'
    },
    status: {
      type: 'VARCHAR(20)',
      required: true,
      defaultValue: 'active',
      enum: ['active', 'inactive', 'suspended'],
      description: 'Employee status'
    },
    availability_status: {
      type: 'VARCHAR(20)',
      required: true,
      defaultValue: 'available',
      enum: ['available', 'busy', 'unavailable'],
      description: 'Availability status'
    },
    profile_image: {
      type: 'TEXT',
      required: false,
      description: 'URL to profile image'
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      defaultValue: 'NOW()',
      description: 'Creation timestamp'
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
      defaultValue: 'NOW()',
      description: 'Last update timestamp'
    }
  }
};

export default employeeSchema;
