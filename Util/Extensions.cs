using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Web;

namespace MTN.Util
{
    public static class Extensions
    {
        public static IQueryable<T> WhereIf<T>(this IQueryable<T> query, bool condition, Expression<Func<T, bool>> predicate)
        {
            return condition
                ? query.Where(predicate)
                : query;
        }
        public static void ForEach<T>(this IEnumerable<T> items, Action<T> action)
        {
            if (items == null)
            {
                return;
            }

            foreach (T obj in items)
            {
                action(obj);
            }
        }
        public static void ForEach<T>(this IEnumerable<T> items, ref int? index, Action<T> action)
        {
            index = index ?? 0;
            if (items == null)
            {
                return;
            }

            foreach (T obj in items)
            {
                action(obj);
                index++;
            }
        }
        public static DateTime? ConvertStringToDate(this string s,
                  string format = "dd/MM/yyyy", string cultureString = "vi-VN")
        {
            try
            {
                DateTime r;
                if (DateTime.TryParseExact(
                    s: s,
                    format: format,
                    provider: CultureInfo.GetCultureInfo(cultureString),
                    style: DateTimeStyles.None,
                    result: out r))
                {
                    return r;
                }
                else
                {
                    return null;
                }
            }
            catch (FormatException)
            {
                throw;
            }
            catch (CultureNotFoundException)
            {
                throw; // Given Culture is not supported culture
            }
        }
    }
}