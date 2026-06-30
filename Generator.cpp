#include "include/Generator.h"

using namespace std;

string generate_cpp(const vector<Token> &tokens)
{
    string out = "#include <iostream>\n#include <string>\nusing namespace std;\n\n";

    for (size_t i = 0; i < tokens.size();)
    {
        Token t = tokens[i];

        if (t.type == TOK_UNKNOWN || t.type == TOK_EOF)
        {
            i++;
            continue;
        }
        if (t.type == TOK_SHURU)
        {
            out += "int main() {\n";
            i++;
            continue;
        }
        if (t.type == TOK_SHESH)
        {
            out += "    return 0;\n}\n";
            i++;
            continue;
        }
        if (t.type == TOK_DHORO)
        {
            out += "    auto ";
            i++;
            continue;
        }

        if (t.type == TOK_DEKHAO)
        {
            size_t j = i + 1;
            string expr;
            while (j < tokens.size() && tokens[j].type != TOK_SEMI && tokens[j].type != TOK_EOF)
            {
                if (tokens[j].type == TOK_STRING)
                    expr += "\"" + tokens[j].value + "\"";
                else
                    expr += tokens[j].value;
                j++;
            }
            out += "    cout << (" + expr + ") << endl;\n";
            if (j < tokens.size() && tokens[j].type == TOK_SEMI)
                j++;
            i = j;
            continue;
        }

        if (t.type == TOK_JODI)
        {
            out += "    if ";
            i++;
            continue;
        }
        if (t.type == TOK_NAHOLE)
        {
            out += "    else ";
            i++;
            continue;
        }
        if (t.type == TOK_JOTOKHON)
        {
            out += "    while ";
            i++;
            continue;
        }
        if (t.type == TOK_KORO)
        {
            out += "    for ";
            i++;
            continue;
        }

        if (t.type == TOK_LBRACE)
        {
            out += " {\n";
            i++;
            continue;
        }
        if (t.type == TOK_RBRACE)
        {
            out += "    }\n";
            i++;
            continue;
        }

        if (t.type == TOK_STRING)
            out += "\"" + t.value + "\"";
        else
            out += t.value;

        i++;
    }
    return out;
}