namespace WorkoutDiary.Api.Tools;

public static class Pluralizer
{
    /// <summary>
    /// Возвращает правильную форму слова "подход" для числа
    /// </summary>
    public static string GetApproachForm(int count)
    {
        if (count < 0) count = Math.Abs(count);
        
        int lastDigit = count % 10;
        int lastTwoDigits = count % 100;

        // Исключения: 11-14
        if (lastTwoDigits >= 11 && lastTwoDigits <= 14)
            return "подходов";

        return lastDigit switch
        {
            1 => "подход",
            2 or 3 or 4 => "подхода",
            _ => "подходов"
        };
    }

    /// <summary>
    /// Возвращает строку вида "3 подхода"
    /// </summary>
    public static string FormatApproaches(int count)
    {
        return $"{count} {GetApproachForm(count)}";
    }
}