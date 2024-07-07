exports.up = (pgm) => {
    pgm.createTable('users', {
      userId: {
        type: 'SERIAL',
        primaryKey: true,
        unique: true,
        notNull: true
      },
      firstName: {
        type: 'VARCHAR(100)',
        notNull: true
      },
      lastName: {
        type: 'VARCHAR(100)',
        notNull: true
      },
      email: {
        type: 'VARCHAR(100)',
        unique: true,
        notNull: true
      },
      password: {
        type: 'VARCHAR(100)',
        notNull: true
      },
      phone: {
        type: 'VARCHAR(20)',
        notNull: false
      }
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('users');
  };
  