export const serviceSchema = {
  tableName: 'services',
  fields: {
    id: {
      type: 'UUID',
      primaryKey: true,
      defaultValue: 'gen_random_uuid()',
      description: 'Unique identifier for service'
    },
    name: {
      type: 'VARCHAR(255)',
      required: true,
      description: 'Service name'
    },
    description: {
      type: 'TEXT',
      required: false,
      description: 'Service description'
    },
    category: {
      type: 'VARCHAR(100)',
      required: true,
      description: 'Service category (e.g., maternal care, newborn care, nutrition)'
    },
    price: {
      type: 'DECIMAL(10,2)',
      required: false,
      defaultValue: 0,
      description: 'Service price'
    },
    duration: {
      type: 'INTEGER',
      required: false,
      defaultValue: 60,
      description: 'Service duration in minutes'
    },
    features: {
      type: 'JSONB',
      required: false,
      defaultValue: '[]',
      description: 'Array of service features'
    },
    status: {
      type: 'VARCHAR(20)',
      required: true,
      defaultValue: 'active',
      enum: ['active', 'inactive'],
      description: 'Service status'
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

export default serviceSchema;
