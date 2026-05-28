import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Graphs, GraphsId } from './graphs';
import type { UpdateLogs, UpdateLogsId } from './update-logs';

export interface UsersAttributes {
  userId: number;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  qtyToken: number;
  createdAt: Date;
}

export type UsersPk = "userId";
export type UsersId = Users[UsersPk];
export type UsersOptionalAttributes = "userId" | "qtyToken" | "createdAt";
export type UsersCreationAttributes = Optional<UsersAttributes, UsersOptionalAttributes>;

export class Users extends Model<UsersAttributes, UsersCreationAttributes> implements UsersAttributes {
  userId!: number;
  username!: string;
  email!: string;
  password!: string;
  isAdmin!: boolean;
  qtyToken!: number;
  createdAt!: Date;

  // Users hasMany Graphs via userId
  graphs!: Graphs[];
  getGraphs!: Sequelize.HasManyGetAssociationsMixin<Graphs>;
  setGraphs!: Sequelize.HasManySetAssociationsMixin<Graphs, GraphsId>;
  addGraph!: Sequelize.HasManyAddAssociationMixin<Graphs, GraphsId>;
  addGraphs!: Sequelize.HasManyAddAssociationsMixin<Graphs, GraphsId>;
  createGraph!: Sequelize.HasManyCreateAssociationMixin<Graphs>;
  removeGraph!: Sequelize.HasManyRemoveAssociationMixin<Graphs, GraphsId>;
  removeGraphs!: Sequelize.HasManyRemoveAssociationsMixin<Graphs, GraphsId>;
  hasGraph!: Sequelize.HasManyHasAssociationMixin<Graphs, GraphsId>;
  hasGraphs!: Sequelize.HasManyHasAssociationsMixin<Graphs, GraphsId>;
  countGraphs!: Sequelize.HasManyCountAssociationsMixin;
  // Users hasMany UpdateLogs via resolvedBy
  updateLogs!: UpdateLogs[];
  getUpdateLogs!: Sequelize.HasManyGetAssociationsMixin<UpdateLogs>;
  setUpdateLogs!: Sequelize.HasManySetAssociationsMixin<UpdateLogs, UpdateLogsId>;
  addUpdateLog!: Sequelize.HasManyAddAssociationMixin<UpdateLogs, UpdateLogsId>;
  addUpdateLogs!: Sequelize.HasManyAddAssociationsMixin<UpdateLogs, UpdateLogsId>;
  createUpdateLog!: Sequelize.HasManyCreateAssociationMixin<UpdateLogs>;
  removeUpdateLog!: Sequelize.HasManyRemoveAssociationMixin<UpdateLogs, UpdateLogsId>;
  removeUpdateLogs!: Sequelize.HasManyRemoveAssociationsMixin<UpdateLogs, UpdateLogsId>;
  hasUpdateLog!: Sequelize.HasManyHasAssociationMixin<UpdateLogs, UpdateLogsId>;
  hasUpdateLogs!: Sequelize.HasManyHasAssociationsMixin<UpdateLogs, UpdateLogsId>;
  countUpdateLogs!: Sequelize.HasManyCountAssociationsMixin;
  // Users hasMany UpdateLogs via requestedBy
  requestedByUpdateLogs!: UpdateLogs[];
  getRequestedByUpdateLogs!: Sequelize.HasManyGetAssociationsMixin<UpdateLogs>;
  setRequestedByUpdateLogs!: Sequelize.HasManySetAssociationsMixin<UpdateLogs, UpdateLogsId>;
  addRequestedByUpdateLog!: Sequelize.HasManyAddAssociationMixin<UpdateLogs, UpdateLogsId>;
  addRequestedByUpdateLogs!: Sequelize.HasManyAddAssociationsMixin<UpdateLogs, UpdateLogsId>;
  createRequestedByUpdateLog!: Sequelize.HasManyCreateAssociationMixin<UpdateLogs>;
  removeRequestedByUpdateLog!: Sequelize.HasManyRemoveAssociationMixin<UpdateLogs, UpdateLogsId>;
  removeRequestedByUpdateLogs!: Sequelize.HasManyRemoveAssociationsMixin<UpdateLogs, UpdateLogsId>;
  hasRequestedByUpdateLog!: Sequelize.HasManyHasAssociationMixin<UpdateLogs, UpdateLogsId>;
  hasRequestedByUpdateLogs!: Sequelize.HasManyHasAssociationsMixin<UpdateLogs, UpdateLogsId>;
  countRequestedByUpdateLogs!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Users {
    return Users.init({
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
      defaultValue: 0,
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
