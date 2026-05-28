import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Graphs, GraphsId } from './graphs';
import type { UpdateLogs, UpdateLogsId } from './update-logs';

export interface EdgesAttributes {
  edgeId: number;
  graphId: number;
  startNode: string;
  endNode: string;
  weight: number;
}

export type EdgesPk = "edgeId";
export type EdgesId = Edges[EdgesPk];
export type EdgesOptionalAttributes = "edgeId";
export type EdgesCreationAttributes = Optional<EdgesAttributes, EdgesOptionalAttributes>;

export class Edges extends Model<EdgesAttributes, EdgesCreationAttributes> implements EdgesAttributes {
  edgeId!: number;
  graphId!: number;
  startNode!: string;
  endNode!: string;
  weight!: number;

  // Edges hasMany UpdateLogs via edgeId
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
  // Edges belongsTo Graphs via graphId
  graph!: Graphs;
  getGraph!: Sequelize.BelongsToGetAssociationMixin<Graphs>;
  setGraph!: Sequelize.BelongsToSetAssociationMixin<Graphs, GraphsId>;
  createGraph!: Sequelize.BelongsToCreateAssociationMixin<Graphs>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Edges {
    return Edges.init({
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
