const assertErr = require('assert-err');
const GraphQLScalarType = require('graphql').GraphQLScalarType;
const GraphQLError = require('graphql/error').GraphQLError;
const Kind = require('graphql/language').Kind;

module.exports = new GraphQLScalarType({
  name: 'Date',
  /**
   * Serialize date value into string
   * @param  {Date} value date value
   * @return {String} date as string
   */
  serialize: function (value) {
    assertErr(value instanceof Date, TypeError, 'Field error: value is not an instance of Date');
    assertErr(!isNaN(value.getTime()), TypeError, 'Field error: value is an invalid Date');
    return value.toJSON();
  },
  /**
   * Parse value into date
   * @param  {*} value serialized date value
   * @return {Date} date value
   */
  parseValue: function (value) {
    const date = new Date(value);
    assertErr(!isNaN(date.getTime()), TypeError, 'Field error: value is an invalid Date');
    return date;
  },
  /**
   * Parse ast literal to date
   * @param  {Object} ast graphql ast
   * @return {Date} date value
   */
  parseLiteral: function (ast) {
    assertErr((ast.kind === Kind.STRING) || (ast.kind === Kind.INT),
      GraphQLError, 'Query error: Can only parse strings to dates but got a: ' + ast.kind, [ast]);
    let result;
    const isTimestamp = /^\d+$/.test(ast.value);
    if(isTimestamp) {
      result = new Date(parseInt(ast.value));
    } else {
      result = new Date();
    }

    assertErr(!isNaN(result.getTime()),
      GraphQLError, 'Query error: Invalid date', [ast]);

    return result;
  }
});