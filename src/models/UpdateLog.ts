import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Edge, EdgeId } from './Edge';
import type { User, UserId } from './User';

export interface UpdateLogAttributes {
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

export type UpdateLogPk = "updateId";
export type UpdateLogId = UpdateLog[UpdateLogPk];
export type UpdateLogOptionalAttributes = "updateId" | "status" | "resolvedBy" | "requestedAt" | "resolvedAt";
export type UpdateLogCreationAttributes = Optional<UpdateLogAttributes, UpdateLogOptionalAttributes>;

export class UpdateLog extends Model<UpdateLogAttributes, UpdateLogCreationAttributes> implements UpdateLogAttributes {
  updateId!: number;
  requestedBy!: number;
  edgeId!: number;
  status!: string;
  oldWeight!: number;
  newWeight!: number;
  resolvedBy?: number;
  requestedAt!: Date;
  resolvedAt?: Date;

  // UpdateLog belongsTo Edge via edgeId
  edge!: Edge;
  getEdge!: Sequelize.BelongsToGetAssociationMixin<Edge>;
  setEdge!: Sequelize.BelongsToSetAssociationMixin<Edge, EdgeId>;
  createEdge!: Sequelize.BelongsToCreateAssociationMixin<Edge>;
  // UpdateLog belongsTo User via resolvedBy
  resolvedByUser!: User;
  getResolvedByUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setResolvedByUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createResolvedByUser!: Sequelize.BelongsToCreateAssociationMixin<User>;
  // UpdateLog belongsTo User via requestedBy
  requestedByUser!: User;
  getRequestedByUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setRequestedByUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createRequestedByUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof UpdateLog {
    return UpdateLog.init({
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
