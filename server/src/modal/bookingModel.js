
export const bookingSchema = {
  tableName: 'bookings',
  fields: {
    id: {
      type: 'UUID',
      primaryKey: true,
      defaultValue: 'gen_random_uuid()',
      description: 'Unique identifier for booking'
    },
    booking_id: {
      type: 'VARCHAR(50)',
      unique: true,
      required: true,
      description: 'Unique booking reference ID'
    },
    user_id: {
      type: 'UUID',
      required: true,
      foreignKey: 'users(id)',
      description: 'Reference to user who made the booking'
    },
    employee_id: {
      type: 'UUID',
      required: false,
      foreignKey: 'employees(id)',
      description: 'Reference to assigned employee'
    },
    service_id: {
      type: 'UUID',
      required: false,
      foreignKey: 'services(id)',
      description: 'Reference to service'
    },
    service_type: {
      type: 'VARCHAR(100)',
      required: true,
      description: 'Type of service requested'
    },
    booking_date: {
      type: 'DATE',
      required: true,
      description: 'Date of booking'
    },
    booking_time: {
      type: 'TIME',
      required: true,
      description: 'Time of booking'
    },
    status: {
      type: 'VARCHAR(20)',
      required: true,
      defaultValue: 'pending',
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      description: 'Booking status'
    },
    notes: {
      type: 'TEXT',
      required: false,
      description: 'Additional notes or requirements'
    },
    address: {
      type: 'TEXT',
      required: false,
      description: 'Service location address'
    },
    total_amount: {
      type: 'DECIMAL(10,2)',
      required: false,
      defaultValue: 0,
      description: 'Total booking amount'
    },
    payment_status: {
      type: 'VARCHAR(20)',
      required: true,
      defaultValue: 'pending',
      enum: ['pending', 'paid', 'refunded', 'failed'],
      description: 'Payment status'
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

export default bookingSchema;
