import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Graph, GraphId } from './Graph';
import type { UpdateLog, UpdateLogId } from './UpdateLog';

export interface EdgeAttributes {
  edgeId: number;
  graphId: number;
  startNode: string;
  endNode: string;
  weight: number;
}

export type EdgePk = "edgeId";
export type EdgeId = Edge[EdgePk];
export type EdgeOptionalAttributes = "edgeId";
export type EdgeCreationAttributes = Optional<EdgeAttributes, EdgeOptionalAttributes>;

export class Edge extends Model<EdgeAttributes, EdgeCreationAttributes> implements EdgeAttributes {
  edgeId!: number;
  graphId!: number;
  startNode!: string;
  endNode!: string;
  weight!: number;

  // Edge hasMany UpdateLog via edgeId
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
  // Edge belongsTo Graph via graphId
  graph!: Graph;
  getGraph!: Sequelize.BelongsToGetAssociationMixin<Graph>;
  setGraph!: Sequelize.BelongsToSetAssociationMixin<Graph, GraphId>;
  createGraph!: Sequelize.BelongsToCreateAssociationMixin<Graph>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Edge {
    return Edge.init({
    edgeId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'edge_id'
    },
    graphId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'graphs',
        key: 'graph_id'
      },
      field: 'graph_id'
    },
    startNode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'start_node'
    },
    endNode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'end_node'
    },
    weight: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'edges',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "edges_pkey",
        unique: true,
        fields: [
          { name: "edge_id" },
        ]
      },
    ]
  });
  }
}
