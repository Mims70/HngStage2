exports.up = (pgm) => {
    pgm.createTable('organisations', {
      orgId: {
        type: 'SERIAL',
        primaryKey: true,
        unique: true,
        notNull: true
      },
      name: {
        type: 'VARCHAR(100)',
        notNull: true
      },
      description: {
        type: 'TEXT',
        notNull: false
      }
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('organisations');
  };
  