import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Graph, GraphId } from './Graph';
import type { UpdateLog, UpdateLogId } from './UpdateLog';

export interface UserAttributes {
  userId: number;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  qtyToken: number;
  createdAt: Date;
}

export type UserPk = "userId";
export type UserId = User[UserPk];
export type UserOptionalAttributes = "userId" | "qtyToken" | "createdAt";
export type UserCreationAttributes = Optional<UserAttributes, UserOptionalAttributes>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  userId!: number;
  username!: string;
  email!: string;
  password!: string;
  isAdmin!: boolean;
  qtyToken!: number;
  createdAt!: Date;

  // User hasMany Graph via userId
  graphs!: Graph[];
  getGraphs!: Sequelize.HasManyGetAssociationsMixin<Graph>;
  setGraphs!: Sequelize.HasManySetAssociationsMixin<Graph, GraphId>;
  addGraph!: Sequelize.HasManyAddAssociationMixin<Graph, GraphId>;
  addGraphs!: Sequelize.HasManyAddAssociationsMixin<Graph, GraphId>;
  createGraph!: Sequelize.HasManyCreateAssociationMixin<Graph>;
  removeGraph!: Sequelize.HasManyRemoveAssociationMixin<Graph, GraphId>;
  removeGraphs!: Sequelize.HasManyRemoveAssociationsMixin<Graph, GraphId>;
  hasGraph!: Sequelize.HasManyHasAssociationMixin<Graph, GraphId>;
  hasGraphs!: Sequelize.HasManyHasAssociationsMixin<Graph, GraphId>;
  countGraphs!: Sequelize.HasManyCountAssociationsMixin;
  // User hasMany UpdateLog via resolvedBy
  updateLogs!: UpdateLog[];
  getUpdateLogs!: Sequelize.HasManyGetAssociationsMixin<UpdateLog>;
  setUpdateLogs!: Sequelize.HasManySetAssociationsMixin<UpdateLog, UpdateLogId>;
  addUpdateLog!: Sequelize.HasManyAddAssociationMixin<UpdateLog, UpdateLogId>;
  addUpdateLogs!: Sequelize.HasManyAddAssociationsMixin<UpdateLog, UpdateLogId>;
  createUpdateLog!: Sequelize.HasManyCreateAssociationMixin<UpdateLog>;
  removeUpdateLog!: Sequelize.HasManyRemoveAssociationMixin<UpdateLog, UpdateLogId>;
  removeUpdateLogs!: Sequelize.HasManyRemoveAssociationsMixin<UpdateLog, UpdateLogId>;
  hasUpdateLog!: Sequelize.HasManyHasAssociationMixin<UpdateLog, UpdateLogId>;
  hasUpdateLogs!: Sequelize.HasManyHasAssociationsMixin<UpdateLog, UpdateLogId>;
  countUpdateLogs!: Sequelize.HasManyCountAssociationsMixin;
  // User hasMany UpdateLog via requestedBy
  requestedByUpdateLogs!: UpdateLog[];
  getRequestedByUpdateLogs!: Sequelize.HasManyGetAssociationsMixin<UpdateLog>;
  setRequestedByUpdateLogs!: Sequelize.HasManySetAssociationsMixin<UpdateLog, UpdateLogId>;
  addRequestedByUpdateLog!: Sequelize.HasManyAddAssociationMixin<UpdateLog, UpdateLogId>;
  addRequestedByUpdateLogs!: Sequelize.HasManyAddAssociationsMixin<UpdateLog, UpdateLogId>;
  createRequestedByUpdateLog!: Sequelize.HasManyCreateAssociationMixin<UpdateLog>;
  removeRequestedByUpdateLog!: Sequelize.HasManyRemoveAssociationMixin<UpdateLog, UpdateLogId>;
  removeRequestedByUpdateLogs!: Sequelize.HasManyRemoveAssociationsMixin<UpdateLog, UpdateLogId>;
  hasRequestedByUpdateLog!: Sequelize.HasManyHasAssociationMixin<UpdateLog, UpdateLogId>;
  hasRequestedByUpdateLogs!: Sequelize.HasManyHasAssociationsMixin<UpdateLog, UpdateLogId>;
  countRequestedByUpdateLogs!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof User {
    return User.init({
    userId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'user_id'
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "users_email_key"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_admin'
    },
    qtyToken: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 1000,
      field: 'qty_token'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now'),
      field: 'created_at'
    },
  }, {
    sequelize,
    tableName: 'users',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "users_email_key",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "users_pkey",
        unique: true,
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
