import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Edges, EdgesId } from './edges';
import type { Users, UsersId } from './users';

export interface UpdateLogsAttributes {
  updateId: number;
  requestedBy: number;
  edgeId: number;
  status: string;
  oldWeight: number;
  newWeight: number;
  resolvedBy?: number;
  requestedAt: Date;
  resolvedAt?: Date;
}

export type UpdateLogsPk = "updateId";
export type UpdateLogsId = UpdateLogs[UpdateLogsPk];
export type UpdateLogsOptionalAttributes = "updateId" | "status" | "resolvedBy" | "requestedAt" | "resolvedAt";
export type UpdateLogsCreationAttributes = Optional<UpdateLogsAttributes, UpdateLogsOptionalAttributes>;

export class UpdateLogs extends Model<UpdateLogsAttributes, UpdateLogsCreationAttributes> implements UpdateLogsAttributes {
  updateId!: number;
  requestedBy!: number;
  edgeId!: number;
  status!: string;
  oldWeight!: number;
  newWeight!: number;
  resolvedBy?: number;
  requestedAt!: Date;
  resolvedAt?: Date;

  // UpdateLogs belongsTo Edges via edgeId
  edge!: Edges;
  getEdge!: Sequelize.BelongsToGetAssociationMixin<Edges>;
  setEdge!: Sequelize.BelongsToSetAssociationMixin<Edges, EdgesId>;
  createEdge!: Sequelize.BelongsToCreateAssociationMixin<Edges>;
  // UpdateLogs belongsTo Users via resolvedBy
  resolvedByUser!: Users;
  getResolvedByUser!: Sequelize.BelongsToGetAssociationMixin<Users>;
  setResolvedByUser!: Sequelize.BelongsToSetAssociationMixin<Users, UsersId>;
  createResolvedByUser!: Sequelize.BelongsToCreateAssociationMixin<Users>;
  // UpdateLogs belongsTo Users via requestedBy
  requestedByUser!: Users;
  getRequestedByUser!: Sequelize.BelongsToGetAssociationMixin<Users>;
  setRequestedByUser!: Sequelize.BelongsToSetAssociationMixin<Users, UsersId>;
  createRequestedByUser!: Sequelize.BelongsToCreateAssociationMixin<Users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof UpdateLogs {
    return UpdateLogs.init({
    updateId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'update_id'
    },
    requestedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'requested_by'
    },
    edgeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'edges',
        key: 'edge_id'
      },
      field: 'edge_id'
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "pending"
    },
    oldWeight: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      field: 'old_weight'
    },
    newWeight: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      field: 'new_weight'
    },
    resolvedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'resolved_by'
    },
    requestedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now'),
      field: 'requested_at'
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'resolved_at'
    }
  }, {
    sequelize,
    tableName: 'update_logs',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "update_logs_pkey",
        unique: true,
        fields: [
          { name: "update_id" },
        ]
      },
    ]
  });
  }
}
