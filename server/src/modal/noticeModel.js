
export const noticeSchema = {
  tableName: 'notices',
  fields: {
    id: {
      type: 'UUID',
      primaryKey: true,
      defaultValue: 'gen_random_uuid()',
      description: 'Unique identifier for notice'
    },
    title: {
      type: 'VARCHAR(500)',
      required: true,
      description: 'Notice title'
    },
    content: {
      type: 'TEXT',
      required: true,
      description: 'Notice content/description'
    },
    type: {
      type: 'VARCHAR(50)',
      required: true,
      defaultValue: 'general',
      enum: ['general', 'urgent', 'announcement', 'event'],
      description: 'Type of notice'
    },
    priority: {
      type: 'VARCHAR(20)',
      required: true,
      defaultValue: 'medium',
      enum: ['low', 'medium', 'high'],
      description: 'Priority level'
    },
    target_audience: {
      type: 'VARCHAR(50)',
      required: true,
      defaultValue: 'all',
      enum: ['all', 'users', 'professionals'],
      description: 'Target audience'
    },
    status: {
      type: 'VARCHAR(20)',
      required: true,
      defaultValue: 'active',
      enum: ['active', 'inactive', 'archived'],
      description: 'Notice status'
    },
    created_by: {
      type: 'UUID',
      required: false,
      description: 'Admin ID who created the notice'
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
    },
    published_at: {
      type: 'TIMESTAMPTZ',
      required: false,
      description: 'Publication timestamp'
    },
    expires_at: {
      type: 'DATE',
      required: false,
      description: 'Expiration date'
    }
  }
};

export default noticeSchema;
