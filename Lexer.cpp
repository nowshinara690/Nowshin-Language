#include "include/Lexer.h"
#include <cctype>

using namespace std;

vector<Token> tokenize(const string &src)
{
    vector<Token> tokens;
    int i = 0, line = 1;
    auto peek = [&]()
    { return i < src.size() ? src[i] : '\0'; };
    auto next = [&]()
    { char c = peek(); i++; if (c == '\n') line++; return c; };

    while (i < src.size())
    {
        char c = peek();

        if (isspace((unsigned char)c))
        {
            next();
            continue;
        }

        if (c == '/' && i + 1 < src.size() && src[i + 1] == '/')
        {
            while (i < src.size() && peek() != '\n')
                next();
            continue;
        }

        if (c == '"')
        {
            string val;
            next();
            while (peek() != '"' && peek() != '\0')
                val += next();
            next();
            tokens.push_back({TOK_STRING, val, line});
            continue;
        }

        if (isdigit(c))
        {
            string val;
            while (isdigit(peek()) || peek() == '.')
                val += next();
            tokens.push_back({TOK_NUMBER, val, line});
            continue;
        }

        if (isalpha(c) || c == '_')
        {
            string val;
            while (isalnum(peek()) || peek() == '_')
                val += next();

            // Multi-word checking for "shuru koro" and "shesh koro"
            if (val == "shuru")
            {
                int j = i;
                while (j < src.size() && isspace((unsigned char)src[j]))
                    j++;
                string nextWord;
                while (j < src.size() && isalpha((unsigned char)src[j]))
                    nextWord += src[j++];
                if (nextWord == "koro")
                {
                    val = "shuru koro";
                    i = j;
                }
            }
            else if (val == "shesh")
            {
                int j = i;
                while (j < src.size() && isspace((unsigned char)src[j]))
                    j++;
                string nextWord;
                while (j < src.size() && isalpha((unsigned char)src[j]))
                    nextWord += src[j++];
                if (nextWord == "koro")
                {
                    val = "shesh koro";
                    i = j;
                }
            }

            // Keyword Matching
            if (val == "shuru koro")
                tokens.push_back({TOK_SHURU, val, line});
            else if (val == "shesh koro")
                tokens.push_back({TOK_SHESH, val, line});
            else if (val == "dhoro")
                tokens.push_back({TOK_DHORO, val, line});
            else if (val == "dekhao")
                tokens.push_back({TOK_DEKHAO, val, line});
            else if (val == "jodi")
                tokens.push_back({TOK_JODI, val, line});
            else if (val == "nahole")
                tokens.push_back({TOK_NAHOLE, val, line});
            else if (val == "koro")
                tokens.push_back({TOK_KORO, val, line});
            else if (val == "jotokhon")
                tokens.push_back({TOK_JOTOKHON, val, line});
            else if (val == "drum")
                tokens.push_back({TOK_DRUM, val, line});
            else if (val == "poro")
                tokens.push_back({TOK_PORO, val, line});
            else
                tokens.push_back({TOK_IDENTIFIER, val, line});
            continue;
        }

        // Operators
        switch (c)
        {
        case '(':
            tokens.push_back({TOK_LPAREN, "(", line});
            next();
            break;
        case ')':
            tokens.push_back({TOK_RPAREN, ")", line});
            next();
            break;
        case '{':
            tokens.push_back({TOK_LBRACE, "{", line});
            next();
            break;
        case '}':
            tokens.push_back({TOK_RBRACE, "}", line});
            next();
            break;
        case '[':
            tokens.push_back({TOK_LBRACKET, "[", line});
            next();
            break;
        case ']':
            tokens.push_back({TOK_RBRACKET, "]", line});
            next();
            break;
        case ';':
            tokens.push_back({TOK_SEMI, ";", line});
            next();
            break;
        case ',':
            tokens.push_back({TOK_COMMA, ",", line});
            next();
            break;
        case '+':
            tokens.push_back({TOK_PLUS, "+", line});
            next();
            break;
        case '-':
            tokens.push_back({TOK_MINUS, "-", line});
            next();
            break;
        case '*':
            tokens.push_back({TOK_MUL, "*", line});
            next();
            break;
        case '/':
            tokens.push_back({TOK_DIV, "/", line});
            next();
            break;
        case '%':
            tokens.push_back({TOK_MOD, "%", line});
            next();
            break;
        case '=':
            next();
            if (peek() == '=')
            {
                next();
                tokens.push_back({TOK_EE, "==", line});
            }
            else
                tokens.push_back({TOK_EQ, "=", line});
            break;
        case '<':
            next();
            if (peek() == '=')
            {
                next();
                tokens.push_back({TOK_LE, "<=", line});
            }
            else
                tokens.push_back({TOK_LT, "<", line});
            break;
        case '>':
            next();
            if (peek() == '=')
            {
                next();
                tokens.push_back({TOK_GE, ">=", line});
            }
            else
                tokens.push_back({TOK_GT, ">", line});
            break;
        case '!':
            next();
            if (peek() == '=')
            {
                next();
                tokens.push_back({TOK_NE, "!=", line});
            }
            else
            {
                next();
                tokens.push_back({TOK_UNKNOWN, "!", line});
            }
            break;
        default:
            next();
            tokens.push_back({TOK_UNKNOWN, string(1, c), line});
            break;
        }
    }
    tokens.push_back({TOK_EOF, "EOF", line});
    return tokens;
}