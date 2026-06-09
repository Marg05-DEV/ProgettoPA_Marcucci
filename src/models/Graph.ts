import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Edge, EdgeId } from './Edge';
import type { User, UserId } from './User';

export interface GraphAttributes {
  graphId: number;
  userId: number;
  name: string;
  description?: string;
  cost: number;
  createdAt: Date;
  updatedAt: Date;
}

export type GraphPk = "graphId";
export type GraphId = Graph[GraphPk];
export type GraphOptionalAttributes = "graphId" | "description" | "cost" | "createdAt" | "updatedAt";
export type GraphCreationAttributes = Optional<GraphAttributes, GraphOptionalAttributes>;

export class Graph extends Model<GraphAttributes, GraphCreationAttributes> implements GraphAttributes {
  graphId!: number;
  userId!: number;
  name!: string;
  description?: string;
  cost!: number;
  createdAt!: Date;
  updatedAt!: Date;

  // Graph hasMany Edge via graphId
  edges!: Edge[];
  getEdges!: Sequelize.HasManyGetAssociationsMixin<Edge>;
  setEdges!: Sequelize.HasManySetAssociationsMixin<Edge, EdgeId>;
  addEdge!: Sequelize.HasManyAddAssociationMixin<Edge, EdgeId>;
  addEdges!: Sequelize.HasManyAddAssociationsMixin<Edge, EdgeId>;
  createEdge!: Sequelize.HasManyCreateAssociationMixin<Edge>;
  removeEdge!: Sequelize.HasManyRemoveAssociationMixin<Edge, EdgeId>;
  removeEdges!: Sequelize.HasManyRemoveAssociationsMixin<Edge, EdgeId>;
  hasEdge!: Sequelize.HasManyHasAssociationMixin<Edge, EdgeId>;
  hasEdges!: Sequelize.HasManyHasAssociationsMixin<Edge, EdgeId>;
  countEdges!: Sequelize.HasManyCountAssociationsMixin;
  // Graph belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Graph {
    return Graph.init({
    graphId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'graph_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'user_id'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cost: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now'),
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now'),
      field: 'updated_at'
    }
  }, {
    sequelize,
    tableName: 'graphs',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "graphs_pkey",
        unique: true,
        fields: [
          { name: "graph_id" },
        ]
      },
    ]
  });
  }
}
